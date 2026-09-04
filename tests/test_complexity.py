from analyzer.metrics.complexity import ComplexityAnalyzer

def test_complexity_evaluation():
    files = [
        {"path": "file1.py", "complexity": 5},
        {"path": "file2.py", "complexity": 30}
    ]
    result = ComplexityAnalyzer.evaluate(files)
    assert result["total"] == 35
    assert result["average"] == 17.5
    assert result["distribution"]["high"] == 1
    assert result["highestComplexityFiles"][0]["file"] == "file2.py"
