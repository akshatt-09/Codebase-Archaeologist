import os
import shutil
import tempfile
from datetime import datetime, timezone

import git
from flask import Blueprint, request, jsonify

from backend.services.repository_service import RepositoryWorkspace
from backend.services.analysis_service import AnalysisService
from backend.utils.github import normalize_github_repository_url
from backend.services.search_service import search_repository
from backend.services.source_service import read_source_window

analysis_bp = Blueprint("analysis", __name__)
STATE = {"analyzed": False, "data": None, "active_temp_dir": None, "health_history": {}, "search_cache": {}}


def _remove_workspace(path):
    if path and os.path.isdir(path):
        shutil.rmtree(path, ignore_errors=True)


def _activate(result, workspace_path):
    """Atomically replace active analysis only after a complete successful scan."""
    previous = STATE.get("active_temp_dir")
    repository = result.get("repository", {})
    repository_key = repository.get("key") or repository.get("sourceUrl") or repository.get("name") or "unknown"
    history = STATE.setdefault("health_history", {}).setdefault(repository_key, [])
    health = result.get("health", {})
    history.append({
        "scannedAt": datetime.now(timezone.utc).isoformat(),
        "repository": repository.get("name", "Repository"),
        "score": health.get("score"),
        "metrics": health.get("metrics", {}),
        "scoreModelVersion": health.get("scoreModel", {}).get("version", "unknown"),
    })
    del history[:-20]
    STATE["data"] = result
    STATE["analyzed"] = True
    STATE["active_temp_dir"] = workspace_path
    STATE["search_cache"] = {}
    if previous and previous != workspace_path:
        _remove_workspace(previous)



@analysis_bp.route("/api/summary", methods=["GET"])
def get_summary():
    if not STATE["analyzed"]:
        return jsonify({"analyzed": False, "message": "No repository analyzed. Upload a repository or provide a GitHub URL to begin."}), 200
    return jsonify(STATE["data"]), 200


@analysis_bp.route("/api/health-history", methods=["GET"])
def get_health_history():
    if not STATE["analyzed"]:
        return jsonify({"history": []}), 200
    repository = STATE["data"].get("repository", {})
    key = request.args.get("repository") or repository.get("key") or repository.get("sourceUrl") or repository.get("name") or "unknown"
    return jsonify({"repository": key, "history": STATE.get("health_history", {}).get(key, [])}), 200


@analysis_bp.route("/api/file-content", methods=["GET"])
def get_file():
    if not STATE["analyzed"]:
        return jsonify({"error": "No repository analyzed"}), 400
    path = request.args.get("path")
    if not path:
        return jsonify({"error": "Missing path parameter"}), 400
    matched = next((item for item in STATE["data"].get("files", []) if item["path"] == path), None)
    if not matched:
        return jsonify({"error": "File not found in analysis cache"}), 404
    abs_path = matched.get("absolute_path")
    if not abs_path or not os.path.isfile(abs_path):
        return jsonify({"error": "Source file not found on server"}), 404
    try:
        source_window = read_source_window(
            abs_path,
            request.args.get("line", default=1, type=int),
            request.args.get("window", default=400, type=int),
        )
        return jsonify({
            "path": path,
            "language": matched.get("language", "Text"),
            **source_window,
        }), 200
    except OSError as exc:
        return jsonify({"error": str(exc)}), 500


@analysis_bp.route("/api/search", methods=["GET"])
def search_active_repository():
    if not STATE["analyzed"]:
        return jsonify({"symbols": [], "files": [], "contentMatches": []}), 200
    query = (request.args.get("q") or "").strip().lower()
    repository = STATE["data"].get("repository", {})
    repository_key = repository.get("key") or repository.get("sourceUrl") or repository.get("name") or "unknown"
    cache_key = (repository_key, query)
    cache = STATE.setdefault("search_cache", {})
    if cache_key not in cache:
        cache[cache_key] = search_repository(STATE["data"], query)
        if len(cache) > 100:
            cache.pop(next(iter(cache)))
    return jsonify(cache[cache_key]), 200

@analysis_bp.route("/api/analyze", methods=["POST"])
def analyze():
    workspace = RepositoryWorkspace()
    try:
        if "file" in request.files:
            uploaded = request.files["file"]
            if not uploaded.filename:
                workspace.cleanup()
                return jsonify({"error": "No file uploaded"}), 400
            if not uploaded.filename.lower().endswith(".zip"):
                workspace.cleanup()
                return jsonify({"error": "Uploaded file must be a .zip archive"}), 400
            repo_path = workspace.handle_zip_upload(uploaded)
        elif "files[]" in request.files:
            file_list = request.files.getlist("files[]")
            if not file_list:
                workspace.cleanup()
                return jsonify({"error": "No files provided in directory upload"}), 400
            repo_path = workspace.handle_raw_files(file_list)
        else:
            workspace.cleanup()
            return jsonify({"error": "No repository payload supplied"}), 400

        result = AnalysisService.execute(repo_path, workspace.repo_name)
        result["repository"]["key"] = f"upload:{workspace.repo_name}"
        _activate(result, workspace.workspace_dir)
        return jsonify(result), 200
    except ValueError as exc:
        workspace.cleanup()
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        workspace.cleanup()
        return jsonify({"error": f"Analysis failed: {str(exc)}"}), 500


@analysis_bp.route("/api/analyze-github", methods=["POST"])
def analyze_github():
    data = request.get_json(silent=True) or {}
    normalized = normalize_github_repository_url((data.get("url") or "").strip())
    if not normalized:
        return jsonify({"error": "Enter a GitHub repository URL in the form https://github.com/owner/repository"}), 400
    clone_url, repo_name = normalized
    candidate_dir = tempfile.mkdtemp(prefix="archaeologist_git_")
    try:
        git.Repo.clone_from(clone_url, candidate_dir, depth=50)
        result = AnalysisService.execute(candidate_dir, repo_name)
        result["repository"]["sourceUrl"] = clone_url[:-4]
        result["repository"]["key"] = clone_url[:-4].lower()
        _activate(result, candidate_dir)
        return jsonify(result), 200
    except git.exc.GitCommandError as exc:
        _remove_workspace(candidate_dir)
        detail = str(exc)
        if "not found" in detail.lower() or "repository not found" in detail.lower():
            message = "Repository not found or access is unavailable. Private repositories require Git credentials."
        else:
            message = "GitHub clone failed. Check the URL, network connection, and repository access."
        return jsonify({"error": message}), 400
    except Exception as exc:
        _remove_workspace(candidate_dir)
        return jsonify({"error": f"Repository analysis failed: {str(exc)}"}), 500
