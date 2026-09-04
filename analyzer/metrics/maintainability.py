class MaintainabilityEngine:
    @staticmethod
    def calculate(total_loc: int, avg_complexity: float, duplication_pct: float, issue_count: int) -> float:
        """Calculates maintainability index scaled to [0, 100]."""
        score = 100.0
        # Penalties based on tangible engineering signals
        if avg_complexity > 10:
            score -= (avg_complexity - 10) * 3
        if isinstance(duplication_pct, (int, float)) and duplication_pct > 5:
            score -= (duplication_pct - 5) * 2
        if total_loc > 5000:
            score -= 5
        score -= min(issue_count * 1.5, 30)
        return max(round(score, 1), 10.0)
