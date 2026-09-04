import os
class CodeHealthEngine:
    @staticmethod
    def audit(files: list[dict], complexity_info: dict, duplication_info: dict) -> dict:
        issues = []
        todo_count = 0

        for f in files:
            path = f["path"]
            abs_path = f.get("absolute_path")
            lines_count = f.get("lines", 0)
            comp = f.get("complexity", 1)

            if comp > 25:
                issues.append({
                    "severity": "critical",
                    "message": f"Excessive cyclomatic complexity ({comp})",
                    "file": path,
                    "line": 1,
                    "metric": "complexity"
                })
            elif comp > 12:
                issues.append({
                    "severity": "warning",
                    "message": f"Moderate cyclomatic complexity ({comp})",
                    "file": path,
                    "line": 1,
                    "metric": "complexity"
                })

            if lines_count > 500:
                issues.append({
                    "severity": "warning",
                    "message": f"Large file detected ({lines_count} lines)",
                    "file": path,
                    "line": 1,
                    "metric": "file_size"
                })

            # Scan source for TODO / FIXME tags
            if abs_path and os.path.exists(abs_path):
                try:
                    with open(abs_path, 'r', encoding='utf-8', errors='ignore') as src:
                        for line_idx, line_str in enumerate(src, 1):
                            if "TODO" in line_str or "FIXME" in line_str:
                                todo_count += 1
                                issues.append({
                                    "severity": "healthy",
                                    "message": f"Technical debt tag: {line_str.strip()[:60]}",
                                    "file": path,
                                    "line": line_idx,
                                    "metric": "debt"
                                })
                except Exception:
                    pass

        # Calculate calculated score
        dup_pct = duplication_info.get("percentage")
        dup_val = dup_pct if isinstance(dup_pct, (int, float)) else 0
        total_loc = sum(f.get("lines", 0) for f in files)
        
        from analyzer.metrics.maintainability import MaintainabilityEngine
        score = MaintainabilityEngine.calculate(total_loc, complexity_info["average"], dup_val, len(issues))

        return {
            "score": score,
            "issues": issues,
            "metrics": {
                "todoCount": todo_count,
                "duplication": dup_pct,
                "testCoverage": "Not available",
                "largeFileCount": sum(1 for f in files if f.get("lines", 0) > 500)
            }
        }

