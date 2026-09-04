import os
import hashlib

class DuplicationDetector:
    BLOCK_SIZE = 6  # Minimum identical consecutive lines to trigger duplication

    @classmethod
    def analyze(cls, file_records: list[dict]) -> dict:
        block_hashes = {}
        duplicated_blocks = []
        total_loc = sum(f.get("lines", 0) for f in file_records)

        if total_loc < cls.BLOCK_SIZE:
            return {"percentage": "Not available", "duplicatedBlocks": []}

        for record in file_records:
            path = record.get("absolute_path")
            if not path or not os.path.exists(path):
                continue
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = [l.strip() for l in f.readlines() if l.strip() and not l.strip().startswith(('#', '//', '/*'))]
                
                for i in range(len(lines) - cls.BLOCK_SIZE + 1):
                    block_text = "".join(lines[i:i + cls.BLOCK_SIZE])
                    h = hashlib.md5(block_text.encode('utf-8')).hexdigest()
                    block_hashes.setdefault(h, []).append((record["path"], i + 1))
            except Exception:
                continue

        duplicated_lines_count = 0
        for h, occurrences in block_hashes.items():
            if len(occurrences) > 1:
                duplicated_lines_count += cls.BLOCK_SIZE * (len(occurrences) - 1)
                duplicated_blocks.append({
                    "occurrences": [{"file": occ[0], "line": occ[1]} for occ in occurrences]
                })

        pct = round((duplicated_lines_count / total_loc) * 100, 2) if total_loc > 0 else 0
        return {
            "percentage": pct,
            "duplicatedBlocks": duplicated_blocks[:15]
        }

