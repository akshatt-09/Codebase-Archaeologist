from analyzer.metrics.health import CodeHealthEngine

def test_health_scoring():
    files = [{"path": "simple.py", "complexity": 2, "lines": 50}]
    complexity_info = {"average": 2.0}
    duplication_info = {"percentage": 0.0}

    health = CodeHealthEngine.audit(files, complexity_info, duplication_info)
    assert health["score"] >= 90.0
    assert health["metrics"]["testCoverage"] == "Not available"
