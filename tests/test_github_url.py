from backend.utils.github import normalize_github_repository_url


def test_normalize_valid_github_url():
    assert normalize_github_repository_url("https://github.com/facebook/react") == (
        "https://github.com/facebook/react.git", "react"
    )
    assert normalize_github_repository_url("https://github.com/owner/repo.git/") == (
        "https://github.com/owner/repo.git", "repo"
    )


def test_reject_non_repository_or_unsafe_github_urls():
    invalid = [
        "http://github.com/owner/repo",
        "https://github.com/owner",
        "https://github.com/owner/repo/tree/main",
        "https://github.com.evil.example/owner/repo",
        "https://github.com/owner/repo?token=secret",
        "https://user:pass@github.com/owner/repo",
    ]
    assert all(normalize_github_repository_url(url) is None for url in invalid)
    assert normalize_github_repository_url(123) is None
