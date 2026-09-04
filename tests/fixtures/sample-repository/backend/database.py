def get_db():
    return DatabaseClient()

class DatabaseClient:
    def query_users(self):
        return ["alice", "bob"]
