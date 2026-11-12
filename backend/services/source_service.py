def read_source_window(path: str, requested_line: int = 1, window: int = 400) -> dict:
    """Read a bounded source window while preserving absolute line numbers."""
    requested_line = max(1, int(requested_line or 1))
    window = min(800, max(100, int(window or 400)))
    with open(path, "r", encoding="utf-8", errors="replace") as source:
        lines = source.readlines()
    total_lines = len(lines)
    start_line = max(1, requested_line - window // 2)
    if requested_line > total_lines:
        start_line = max(1, total_lines - window + 1)
    end_line = min(total_lines, start_line + window - 1)
    selected = lines[start_line - 1:end_line]
    return {
        "content": "".join(selected),
        "startLine": start_line,
        "totalLines": total_lines,
        "truncated": total_lines > len(selected),
    }
