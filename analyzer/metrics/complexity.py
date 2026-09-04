class ComplexityAnalyzer:
    @staticmethod
    def categorize_risk(complexity: int) -> str:
        if complexity > 25:
            return "critical"
        if complexity > 12:
            return "warning"
        return "healthy"

    @classmethod
    def evaluate(cls, files: list[dict]) -> dict:
        total = 0
        distribution = {"low": 0, "medium": 0, "high": 0}
        file_metrics = []

        for f in files:
            c = f.get("complexity", 1)
            total += c
            risk = cls.categorize_risk(c)
            if risk == "healthy":
                distribution["low"] += 1
            elif risk == "warning":
                distribution["medium"] += 1
            else:
                distribution["high"] += 1

            file_metrics.append({
                "file": f["path"],
                "complexity": c,
                "risk": risk
            })

        file_metrics.sort(key=lambda x: x["complexity"], reverse=True)
        avg = round(total / len(files), 2) if files else 0

        return {
            "total": total,
            "average": avg,
            "distribution": distribution,
            "highestComplexityFiles": file_metrics[:10]
        }
