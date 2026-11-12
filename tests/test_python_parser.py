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


def test_parser_indexes_module_level_variables():
    from analyzer.parsers.python import PythonSourceParser

    parsed = PythonSourceParser.parse("API_URL = '/api'\ncount: int = 0\ndef run():\n    local = 1\n", "settings.py")
    indexed = {(symbol["name"], symbol["kind"]) for symbol in parsed["symbols"]}
    assert ("API_URL", "constant") in indexed
    assert ("count", "variable") in indexed
    assert ("local", "variable") not in indexed
