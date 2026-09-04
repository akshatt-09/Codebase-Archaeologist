import os
from flask import Blueprint, request, jsonify
from backend.services.repository_service import RepositoryWorkspace
from backend.services.analysis_service import AnalysisService

analysis_bp = Blueprint('analysis', __name__)

STATE = {
    "analyzed": False,
    "data": None
}

@analysis_bp.route('/api/summary', methods=['GET'])
def get_summary():
    if not STATE["analyzed"]:
        return jsonify({
            "analyzed": False,
            "message": "No repository analyzed. Upload a repository to begin exploring its architecture."
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
        return jsonify({"error": "File not found"}), 404

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
