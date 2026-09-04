import os
from werkzeug.utils import secure_filename

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024       # 5 MB
MAX_TOTAL_EXTRACT_BYTES = 100 * 1024 * 1024  # 100 MB

def is_safe_path(base_dir: str, path: str, follow_symlinks: bool = False) -> bool:
    """Verifies that path stays strictly within base_dir without path traversal."""
    if follow_symlinks:
        matchpath = os.path.realpath(path)
    else:
        matchpath = os.path.abspath(path)
    return base_dir == os.path.commonpath((base_dir, matchpath))

def sanitize_relative_path(path: str) -> str:
    """Normalizes relative path and removes leading slashes and traversal dots."""
    normalized = os.path.normpath(path).replace('\\', '/')
    while normalized.startswith('../') or normalized.startswith('/'):
        normalized = normalized.lstrip('./')
    return normalized
