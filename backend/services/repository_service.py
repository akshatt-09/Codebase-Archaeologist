import os
import shutil
import tempfile
from backend.services.ingestion import extract_safe_zip, discover_repository_files

class RepositoryWorkspace:
    def __init__(self):
        self.workspace_dir = tempfile.mkdtemp(prefix="repo_arch_")
        self.files = []
        self.repo_name = "Uploaded Repository"

    def handle_zip_upload(self, zip_storage) -> str:
        zip_path = os.path.join(self.workspace_dir, "upload.zip")
        zip_storage.save(zip_path)
        self.repo_name = os.path.splitext(zip_storage.filename or "repository")[0]
        extract_dir = os.path.join(self.workspace_dir, "extracted")
        os.makedirs(extract_dir, exist_ok=True)
        extract_safe_zip(zip_path, extract_dir)
        
        # Detect single parent directory wrapper in ZIPs
        entries = os.listdir(extract_dir)
        if len(entries) == 1 and os.path.isdir(os.path.join(extract_dir, entries[0])):
            self.extracted_path = os.path.join(extract_dir, entries[0])
            self.repo_name = entries[0]
        else:
            self.extracted_path = extract_dir
            
        return self.extracted_path

    def handle_raw_files(self, files_list) -> str:
        extract_dir = os.path.join(self.workspace_dir, "extracted")
        os.makedirs(extract_dir, exist_ok=True)
        for storage in files_list:
            rel = storage.filename.replace("\\", "/").lstrip("/")
            dest = os.path.abspath(os.path.join(extract_dir, rel))
            if not dest.startswith(os.path.abspath(extract_dir) + os.sep):
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            storage.save(dest)
        self.extracted_path = extract_dir
        return self.extracted_path

    def cleanup(self):
        if os.path.exists(self.workspace_dir):
            shutil.rmtree(self.workspace_dir, ignore_errors=True)
