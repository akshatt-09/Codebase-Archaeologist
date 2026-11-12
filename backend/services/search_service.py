import os


def search_repository(data: dict, query: str, limit: int = 200) -> dict:
    """Search indexed symbols, repository paths, and actual source lines."""
    needle = (query or "").strip().lower()
    if not needle:
        return {"symbols": [], "files": [], "contentMatches": []}

    symbols = [symbol for symbol in data.get("symbols", []) if needle in str(symbol.get("name", "")).lower()][:limit]
    files = [entry for entry in data.get("files", []) if needle in str(entry.get("path", "")).lower()][:limit]
    content_matches = []
    for entry in data.get("files", []):
        absolute_path = entry.get("absolute_path")
        if not absolute_path or not os.path.isfile(absolute_path):
            continue
        try:
            with open(absolute_path, "r", encoding="utf-8", errors="replace") as source:
                for line_number, line in enumerate(source, 1):
                    if needle in line.lower():
                        content_matches.append({"file": entry["path"], "line": line_number, "snippet": line.strip()[:240]})
                        if len(content_matches) >= limit:
                            return {"symbols": symbols, "files": files, "contentMatches": content_matches}
        except OSError:
            continue
    return {"symbols": symbols, "files": files, "contentMatches": content_matches}
