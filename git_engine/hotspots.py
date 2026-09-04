from git_engine.churn import get_churn

def get_hotspots(repo_path: str) -> list[dict]:
    return get_churn(repo_path)
