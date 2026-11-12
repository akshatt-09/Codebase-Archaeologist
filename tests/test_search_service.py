from backend.services.search_service import search_repository


def test_search_finds_symbols_paths_and_real_source_lines(tmp_path):
    source = tmp_path / "service.py"
    source.write_text("def create_user():\n    return 'user-created'\n", encoding="utf-8")
    data = {
        "symbols": [{"name": "create_user", "kind": "function", "file": "service.py", "line": 1}],
        "files": [{"path": "service.py", "absolute_path": str(source), "language": "Python", "lines": 2}],
    }
    result = search_repository(data, "user")
    assert result["symbols"][0]["name"] == "create_user"
    assert result["contentMatches"]
    path_result = search_repository(data, "service")
    assert path_result["files"][0]["path"] == "service.py"
