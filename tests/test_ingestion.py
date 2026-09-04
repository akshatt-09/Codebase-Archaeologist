import os
import pytest
from backend.services.ingestion import is_binary_file, discover_repository_files

def test_binary_detection(tmp_path):
    bin_file = tmp_path / "binary.bin"
    bin_file.write_bytes(b"\x00\x01\x02\x03")
    text_file = tmp_path / "text.txt"
    text_file.write_text("hello world")

    assert is_binary_file(str(bin_file)) is True
    assert is_binary_file(str(text_file)) is False

def test_file_discovery_ignores(tmp_path):
    (tmp_path / "node_modules").mkdir()
    (tmp_path / "node_modules" / "pkg.js").write_text("console.log()")
    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "index.js").write_text("console.log()")

    discovered = discover_repository_files(str(tmp_path))
    paths = [d["path"] for d in discovered]
    assert "src/index.js" in paths
    assert "node_modules/pkg.js" not in paths
