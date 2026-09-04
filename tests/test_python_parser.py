from analyzer.parsers.python import PythonSourceParser

def test_python_parsing_extraction():
    code = """
import sys
from os import path

class Processor:
    def run(self, flag):
        if flag and True:
            return 1
        return 0
"""
    result = PythonSourceParser.parse(code, "test.py")
    assert len(result["imports"]) == 2
    assert len(result["classes"]) == 1
    assert result["classes"][0]["name"] == "Processor"
    assert len(result["functions"]) == 1
    assert result["functions"][0]["name"] == "run"
    assert result["complexity"] >= 2
