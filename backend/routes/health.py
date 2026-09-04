from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def check_health():
    return jsonify({
        "status": "online",
        "service": "Codebase Archaeologist Backend",
        "version": "1.0.0"
    }), 200
