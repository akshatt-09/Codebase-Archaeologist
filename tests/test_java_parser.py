from analyzer.parsers.java import JavaSourceParser

def test_java_parsing():
    code = """
package com.demo.service;

import java.util.List;

public class DemoService {
    public void execute() {
        if (true) {}
    }
}
"""
    result = JavaSourceParser.parse(code, "DemoService.java")
    assert result["package"] == "com.demo.service"
    assert len(result["imports"]) == 1
    assert len(result["classes"]) == 1
    assert len(result["functions"]) == 1
