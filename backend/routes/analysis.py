import os
import shutil
import tempfile
import git
from flask import Blueprint, request, jsonify
from backend.services.repository_service import RepositoryWorkspace
from backend.services.analysis_service import AnalysisService

analysis_bp = Blueprint('analysis', __name__)

STATE = {
    "analyzed": False,
    "data": None,
    "active_temp_dir": None
}

def _cleanup_previous_temp():
    """Clean previous cloned directory to save disk space."""
    if STATE["active_temp_dir"] and os.path.exists(STATE["active_temp_dir"]):
        try:
            shutil.rmtree(STATE["active_temp_dir"], ignore_errors=True)
        except Exception:
            pass
        STATE["active_temp_dir"] = None


@analysis_bp.route('/api/summary', methods=['GET'])
def get_summary():
    if not STATE["analyzed"]:
        return jsonify({
            "analyzed": False,
            "message": "No repository analyzed. Upload a repository or provide a GitHub URL to begin."
        }), 200
    return jsonify(STATE["data"]), 200


@analysis_bp.route('/api/file-content', methods=['GET'])
def get_file():
    if not STATE["analyzed"]:
        return jsonify({"error": "No repository analyzed"}), 400

    path = request.args.get('path')
    if not path:
        return jsonify({"error": "Missing path parameter"}), 400

    stored_files = STATE["data"].get("files", [])
    matched = next((f for f in stored_files if f["path"] == path), None)
    if not matched:
        return jsonify({"error": "File not found in analysis cache"}), 404

    abs_path = matched.get("absolute_path")
    if not abs_path or not os.path.exists(abs_path):
        return jsonify({"error": "Source file not found on server"}), 404

    try:
        with open(abs_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        return jsonify({
            "path": path,
            "language": matched.get("language", "Text"),
            "content": content
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@analysis_bp.route('/api/analyze', methods=['POST'])
def analyze():
    _cleanup_previous_temp()
    workspace = RepositoryWorkspace()
    try:
        if "file" in request.files:
            uploaded = request.files["file"]
            if uploaded.filename == "":
                return jsonify({"error": "No file uploaded"}), 400
            if not uploaded.filename.endswith(".zip"):
                return jsonify({"error": "Uploaded file must be a .zip archive"}), 400
            repo_path = workspace.handle_zip_upload(uploaded)
        elif "files[]" in request.files:
            file_list = request.files.getlist("files[]")
            if not file_list:
                return jsonify({"error": "No files provided in directory upload"}), 400
            repo_path = workspace.handle_raw_files(file_list)
        else:
            return jsonify({"error": "No repository payload supplied"}), 400

        result = AnalysisService.execute(repo_path, workspace.repo_name)
        STATE["analyzed"] = True
        STATE["data"] = result
        return jsonify(result), 200

    except ValueError as val_err:
        return jsonify({"error": str(val_err)}), 400
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500


@analysis_bp.route('/api/analyze-github', methods=['POST'])
def analyze_github():
    data = request.get_json(silent=True) or {}
    repo_url = data.get('url', '').strip()

    if not repo_url:
        return jsonify({"error": "GitHub repository URL is required"}), 400

    if not repo_url.startswith("https://github.com/"):
        return jsonify({"error": "Please provide a valid https://github.com/... URL"}), 400

    # Clean previous temp clone if one was active
    _cleanup_previous_temp()

    temp_dir = tempfile.mkdtemp(prefix="archaeologist_git_")
    STATE["active_temp_dir"] = temp_dir

    try:
        # Extract repo name from URL (e.g. 'my-portfolio' from '.../akshatt-09/my-portfolio.git')
        clean_url = repo_url[:-4] if repo_url.endswith('.git') else repo_url
        repo_name = clean_url.rstrip('/').split('/')[-1]

        # Clone last 50 commits: keeps it fast while preserving complete commit & churn history
        git.Repo.clone_from(repo_url, temp_dir, depth=50)

        # Run core analysis pipeline
        result = AnalysisService.execute(temp_dir, repo_name)

        # Sync global state so summary & file-content endpoints work seamlessly
        STATE["analyzed"] = True
        STATE["data"] = result

        return jsonify(result), 200

    except Exception as e:
        _cleanup_previous_temp()
        return jsonify({"error": f"Failed to clone or analyze repository: {str(e)}"}), 500