import os
from .database import get_db

class ApiServer:
    def __init__(self, port=8080):
        self.port = port
        self.db = get_db()

    def handle_request(self, path):
        if path == "/api/status":
            return {"status": "ok"}
        elif path == "/api/users":
            return self.db.query_users()
        return {"error": "not found"}
