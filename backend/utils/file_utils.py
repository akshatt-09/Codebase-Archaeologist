import os
from backend.utils.security import MAX_FILE_SIZE_BYTES

DEFAULT_IGNORED_DIRS = {
    '.git', 'node_modules', 'dist', 'build', '.venv', 'venv', 
    '__pycache__', '.idea', '.next', 'coverage', '.cache', '.vscode'
}

def is_binary_file(filepath: str) -> bool:
    """Detects binary content by scanning first 1024 bytes for null bytes."""
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
            return b'\0' in chunk
    except Exception:
        return True

def scan_directory(base_dir: str, ignored_dirs: set = None) -> list[dict]:
    """Recursively scans directory safely excluding ignored directories."""
    if ignored_dirs is None:
        ignored_dirs = DEFAULT_IGNORED_DIRS

    discovered = []
    base_abs = os.path.abspath(base_dir)

    for root, dirs, files in os.walk(base_dir, topdown=True):
        dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith('.')]
        for file in files:
            full_path = os.path.abspath(os.path.join(root, file))
            if not full_path.startswith(base_abs + os.sep) and full_path != base_abs:
                continue
            try:
                st = os.stat(full_path)
                if st.st_size > MAX_FILE_SIZE_BYTES or is_binary_file(full_path):
                    continue
                rel_path = os.path.relpath(full_path, base_abs).replace('\\', '/')
                discovered.append({
                    "path": rel_path,
                    "absolute_path": full_path,
                    "size": st.st_size
                })
            except (OSError, PermissionError):
                continue
    return discovered
