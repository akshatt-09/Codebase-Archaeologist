from analyzer.metrics.health import CodeHealthEngine

def test_health_scoring():
    files = [{"path": "simple.py", "complexity": 2, "lines": 50}]
    complexity_info = {"average": 2.0}
    duplication_info = {"percentage": 0.0}

    health = CodeHealthEngine.audit(files, complexity_info, duplication_info)
    assert health["score"] >= 90.0
    assert health["metrics"]["testCoverage"] == "Not available"


def test_repository_size_alone_does_not_reduce_health_score():
    from analyzer.metrics.maintainability import MaintainabilityEngine

    small = MaintainabilityEngine.calculate(100, 4, 0, 0)
    large = MaintainabilityEngine.calculate(500_000, 4, 0, 0)
    assert small == large == 100.0


def test_todo_is_informational_and_fixme_is_actionable(tmp_path):
    from analyzer.metrics.health import CodeHealthEngine

    source = tmp_path / "notes.py"
    source.write_text("# TODO: clarify this\n# FIXME: handle edge case\n", encoding="utf-8")
    files = [{"path": "notes.py", "absolute_path": str(source), "complexity": 1, "lines": 2}]
    health = CodeHealthEngine.audit(files, {"average": 1}, {"percentage": 0})
    severities = [issue["severity"] for issue in health["issues"]]
    assert severities == ["info", "warning"]
    assert health["metrics"]["todoCount"] == 1
    assert health["metrics"]["fixmeCount"] == 1


def test_unavailable_duplication_is_not_reported_as_zero():
    health = CodeHealthEngine.audit(
        [{"path": "tiny.py", "complexity": 1, "lines": 2}],
        {"average": 1},
        {"percentage": "Not available"},
    )
    assert health["scoreModel"]["duplicationPenalty"] is None
    assert health["scoreModel"]["duplicationAvailable"] is False
    assert health["scoreModel"]["isPartial"] is True
    assert health["metrics"]["duplication"] == "Not available"



def test_large_file_size_is_informational_not_a_score_penalty():
    health = CodeHealthEngine.audit(
        [{"path": "large.py", "complexity": 1, "lines": 1200}],
        {"average": 1},
        {"percentage": 0},
    )
    assert health["score"] == 100.0
    assert health["issues"][0]["severity"] == "info"


def test_generated_lockfiles_are_excluded_from_duplication_analysis(tmp_path):
    from analyzer.metrics.duplication import DuplicationDetector

    block = "\n".join([f"const value_{index} = {index};" for index in range(6)])
    source = tmp_path / "source.js"
    lock = tmp_path / "package-lock.json"
    source.write_text(block, encoding="utf-8")
    lock.write_text(block, encoding="utf-8")
    result = DuplicationDetector.analyze([
        {"path": "src/source.js", "absolute_path": str(source), "lines": 6},
        {"path": "package-lock.json", "absolute_path": str(lock), "lines": 6},
    ])
    assert result["percentage"] == 0.0
    assert result["duplicatedBlocks"] == []


def test_score_is_reproducible_for_identical_inputs():
    files = [{"path": "stable.py", "complexity": 8, "lines": 120}]
    complexity = {"average": 8.0}
    duplication = {"percentage": 12.5}
    first = CodeHealthEngine.audit(files, complexity, duplication)
    second = CodeHealthEngine.audit(files, complexity, duplication)
    assert first["score"] == second["score"]
    assert first["scoreModel"] == second["scoreModel"]


def test_duplication_occurrence_preserves_actual_source_line_numbers(tmp_path):
    from analyzer.metrics.duplication import DuplicationDetector

    block = "\n".join([f"value_{index} = {index}" for index in range(6)])
    first = tmp_path / "first.py"
    second = tmp_path / "second.py"
    first.write_text("# header\n\n" + block + "\n", encoding="utf-8")
    second.write_text("# another header\n\n" + block + "\n", encoding="utf-8")
    result = DuplicationDetector.analyze([
        {"path": "first.py", "absolute_path": str(first), "lines": 8},
        {"path": "second.py", "absolute_path": str(second), "lines": 8},
    ])
    assert result["duplicatedBlocks"]
    assert result["duplicatedBlocks"][0]["occurrences"][0]["line"] == 3
