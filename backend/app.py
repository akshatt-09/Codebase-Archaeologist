from flask import Flask
from flask_cors import CORS

from backend.routes.health import health_bp
from backend.routes.analysis import analysis_bp

app = Flask(__name__)

# Allow cross-origin requests from the Vite frontend
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(health_bp)
app.register_blueprint(analysis_bp)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)