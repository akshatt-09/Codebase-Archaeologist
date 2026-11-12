import os
from analyzer.metrics.maintainability import MaintainabilityEngine


class CodeHealthEngine:
    @staticmethod
    def audit(files: list[dict], complexity_info: dict, duplication_info: dict) -> dict:
        issues = []
        todo_count = 0
        fixme_count = 0

        for file_entry in files:
            path = file_entry["path"]
            abs_path = file_entry.get("absolute_path")
            complexity = file_entry.get("complexity", 1)
            line_count = file_entry.get("lines", 0)

            if complexity > 25:
                issues.append({"severity": "critical", "message": f"Excessive cyclomatic complexity ({complexity})", "file": path, "line": 1, "metric": "complexity"})
            elif complexity > 12:
                issues.append({"severity": "warning", "message": f"Moderate cyclomatic complexity ({complexity})", "file": path, "line": 1, "metric": "complexity"})

            if line_count > 500:
                issues.append({"severity": "info", "message": f"Large file detected ({line_count} lines); review its responsibilities if it is difficult to maintain", "file": path, "line": 1, "metric": "file_size"})

            if abs_path and os.path.exists(abs_path):
                try:
                    with open(abs_path, "r", encoding="utf-8", errors="ignore") as source:
                        for line_idx, line in enumerate(source, 1):
                            upper = line.upper()
                            if "FIXME" in upper:
                                fixme_count += 1
                                issues.append({"severity": "warning", "message": f"FIXME technical-debt marker: {line.strip()[:100]}", "file": path, "line": line_idx, "metric": "debt"})
                            elif "TODO" in upper:
                                todo_count += 1
                                issues.append({"severity": "info", "message": f"TODO note: {line.strip()[:100]}", "file": path, "line": line_idx, "metric": "debt"})
                except OSError:
                    pass

        dup_pct = duplication_info.get("percentage")
        duplication_value = dup_pct if isinstance(dup_pct, (int, float)) else None
        avg_complexity = complexity_info.get("average", 1)
        actionable_count = sum(1 for issue in issues if issue["severity"] in ("critical", "warning"))
        severity_counts = {severity: sum(1 for issue in issues if issue["severity"] == severity) for severity in ("critical", "warning", "info")}
        score = MaintainabilityEngine.calculate(
            sum(f.get("lines", 0) for f in files), avg_complexity, duplication_value, actionable_count
        )
        breakdown = MaintainabilityEngine.breakdown(avg_complexity, duplication_value, actionable_count)

        return {
            "score": score,
            "issues": issues,
            "scoreModel": {
                "version": "2.0",
                "averageComplexity": avg_complexity,
                "duplicationPercentage": dup_pct if isinstance(dup_pct, (int, float)) else None,
                "duplicationMethod": duplication_info.get("method", "Six-line normalized source blocks; limitations depend on parser/file coverage."),
                "actionableFindingCount": actionable_count,
                "isPartial": duplication_value is None,
                "measuredSignals": ["complexity", "actionable findings"] + (["duplication"] if duplication_value is not None else []),
                **breakdown,
            },
            "metrics": {
                "todoCount": todo_count,
                "fixmeCount": fixme_count,
                "severityCounts": severity_counts,
                "duplication": dup_pct,
                "duplicationMethod": duplication_info.get("method", "Not available"),
                "testCoverage": "Not available",
                "largeFileCount": sum(1 for f in files if f.get("lines", 0) > 500),
                "averageComplexity": avg_complexity,
            },
        }
