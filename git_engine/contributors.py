from git_engine.history import analyze_git_repository

def get_contributors(repo_path: str) -> list[dict]:
    data = analyze_git_repository(repo_path)
    return data.get("contributors", []) if data.get("available") else []
