# Standalone export for commits inspection
from git_engine.history import analyze_git_repository

def get_commits(repo_path: str) -> list[dict]:
    data = analyze_git_repository(repo_path)
    return data.get("commits", []) if data.get("available") else []
