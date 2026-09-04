import os
import zipfile
import shutil
import tempfile
from werkzeug.utils import secure_filename

DEFAULT_IGNORED_DIRS = {
    '.git', 'node_modules', 'dist', 'build', '.venv', 'venv', 
    '__pycache__', '.idea', '.next', 'coverage', '.cache', '.vscode'
}

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB per file
MAX_TOTAL_EXTRACT_BYTES = 100 * 1024 * 1024  # 100MB repository limit

def is_binary_file(filepath: str) -> bool:
    """Detect if a file contains null bytes within its first 1024 bytes."""
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
            if b'\0' in chunk:
                return True
        return False
    except Exception:
        return True

def extract_safe_zip(zip_path: str, target_dir: str) -> list[str]:
    """Safely unpack zip files guarding against path traversal (Zip Slip)."""
    extracted_files = []
    total_size = 0
    
    with zipfile.ZipFile(zip_path, 'r') as archive:
        for member in archive.infolist():
            target_path = os.path.abspath(os.path.join(target_dir, member.filename))
            if not target_path.startswith(os.path.abspath(target_dir) + os.sep):
                raise ValueError(f"Malicious zip entry detected: {member.filename}")
            
            total_size += member.file_size
            if total_size > MAX_TOTAL_EXTRACT_BYTES:
                raise ValueError("Total extracted repository size exceeds quota (100MB)")
                
            if member.file_size > MAX_FILE_SIZE_BYTES:
                continue  # Skip oversized individual files safely

            archive.extract(member, target_dir)
            if not member.is_dir():
                extracted_files.append(target_path)
                
    return extracted_files

def discover_repository_files(base_dir: str, ignored_dirs: set = None) -> list[dict]:
    """Traverse repository path and gather file records with path containment."""
    if ignored_dirs is None:
        ignored_dirs = DEFAULT_IGNORED_DIRS

    discovered = []
    base_abs = os.path.abspath(base_dir)

    for root, dirs, files in os.walk(base_dir, topdown=True):
        # In-place directory exclusion
        dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith('.')]
        
        for file in files:
            full_path = os.path.abspath(os.path.join(root, file))
            if not full_path.startswith(base_abs):
                continue
            
            rel_path = os.path.relpath(full_path, base_abs).replace("\\", "/")
            
            try:
                st = os.stat(full_path)
                if st.st_size > MAX_FILE_SIZE_BYTES or is_binary_file(full_path):
                    continue
                
                discovered.append({
                    "path": rel_path,
                    "absolute_path": full_path,
                    "size": st.st_size
                })
            except (OSError, PermissionError):
                continue

    return discovered
