class MaintainabilityEngine:
    """Deterministic, size-neutral maintainability estimate.

    LOC is intentionally excluded. Missing metrics are omitted from the score
    rather than silently interpreted as zero; the score model reports them.
    """

    @staticmethod
    def calculate(total_loc: int, avg_complexity: float, duplication_pct: float | None, issue_count: int) -> float:
        score = 100.0
        complexity = max(float(avg_complexity or 0), 1.0)
        score -= min(max(complexity - 5, 0) * 2.0, 30.0)
        if isinstance(duplication_pct, (int, float)):
            duplication = max(float(duplication_pct), 0.0)
            score -= min(max(duplication - 3, 0) * 1.5, 30.0)
        score -= min(max(int(issue_count or 0), 0) * 2.0, 30.0)
        return round(max(0.0, min(100.0, score)), 1)

    @staticmethod
    def breakdown(avg_complexity: float, duplication_pct: float | None, issue_count: int) -> dict:
        complexity = max(float(avg_complexity or 0), 1.0)
        duplication_penalty = None
        if isinstance(duplication_pct, (int, float)):
            duplication_penalty = round(min(max(float(duplication_pct) - 3, 0) * 1.5, 30.0), 1)
        return {
            "base": 100.0,
            "complexityPenalty": round(min(max(complexity - 5, 0) * 2.0, 30.0), 1),
            "duplicationPenalty": duplication_penalty,
            "findingPenalty": round(min(max(int(issue_count or 0), 0) * 2.0, 30.0), 1),
            "locNeutral": True,
            "duplicationAvailable": duplication_penalty is not None,
            "formula": "100 - complexity penalty - duplication penalty (when measurable) - actionable finding penalty (clamped to 0–100)",
        }
