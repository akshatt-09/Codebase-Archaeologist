import os
import git
from git.exc import InvalidGitRepositoryError, NoSuchPathError

def analyze_git_repository(repo_path: str) -> dict:
    git_dir = os.path.join(repo_path, '.git')
    if not os.path.exists(git_dir):
        return {
            "available": False,
            "message": "Git metadata unavailable. The uploaded repository does not contain Git history."
        }

    try:
        repo = git.Repo(repo_path)
    except (InvalidGitRepositoryError, NoSuchPathError):
        return {
            "available": False,
            "message": "Git metadata unavailable. The uploaded repository does not contain Git history."
        }

    try:
        head_commit = repo.head.commit
        active_branch = repo.active_branch.name if not repo.head.is_detached else "detached-HEAD"
        head_sha = head_commit.hexsha[:7]
    except Exception:
        return {
            "available": False,
            "message": "Git repository is initialized but contains no commits."
        }

    commits_list = []
    contributors = {}
    churn_files = {}

    try:
        for c in repo.iter_commits(max_count=50):
            author_email = c.author.email
            author_name = c.author.name
            contributors[author_email] = {
                "name": author_name,
                "email": author_email,
                "commits": contributors.get(author_email, {}).get("commits", 0) + 1
            }

            stats = c.stats
            for fname, fstat in stats.files.items():
                churn_files[fname] = churn_files.get(fname, 0) + fstat.get("lines", 0)

            commits_list.append({
                "sha": c.hexsha[:7],
                "message": c.message.strip(),
                "author": author_name,
                "date": c.authored_datetime.isoformat(),
                "insertions": stats.total.get("insertions", 0),
                "deletions": stats.total.get("deletions", 0)
            })
    except Exception:
        pass

    hotspots = sorted([{"file": k, "churn": v} for k, v in churn_files.items()], key=lambda x: x["churn"], reverse=True)

    return {
        "available": True,
        "branch": active_branch,
        "head": head_sha,
        "totalCommits": len(commits_list),
        "contributors": list(contributors.values()),
        "commits": commits_list,
        "hotspots": hotspots[:10]
    }
