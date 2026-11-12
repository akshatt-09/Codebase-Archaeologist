import re
from urllib.parse import urlparse


def normalize_github_repository_url(value: str):
    """Return a safe HTTPS clone URL and repository name for owner/repo URLs."""
    if not isinstance(value, str):
        return None
    parsed = urlparse(value.strip())
    if parsed.scheme != "https" or parsed.netloc.lower() not in ("github.com", "www.github.com"):
        return None
    if parsed.query or parsed.fragment or parsed.username or parsed.password:
        return None
    parts = [part for part in parsed.path.strip("/").split("/") if part]
    if len(parts) != 2:
        return None
    owner, repo = parts
    repo = re.sub(r"\.git$", "", repo, flags=re.IGNORECASE)
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", owner) or not re.fullmatch(r"[A-Za-z0-9_.-]+", repo):
        return None
    return f"https://github.com/{owner}/{repo}.git", repo
