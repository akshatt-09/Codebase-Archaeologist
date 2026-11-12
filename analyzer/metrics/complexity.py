class ComplexityAnalyzer:
    SUPPORTED_LANGUAGES = {"Python", "JavaScript", "JSX", "TypeScript", "TSX", "Java"}

    @staticmethod
    def categorize_risk(complexity: int) -> str:
        if complexity > 25:
            return "critical"
        if complexity > 12:
            return "warning"
        return "healthy"

    @classmethod
    def evaluate(cls, files: list[dict]) -> dict:
        # Exclude unparsed docs/assets from the average so repository size or
        # non-code file counts cannot dilute the measured complexity signal.
        eligible = [
            entry for entry in files
            if "language" not in entry or entry.get("language") in cls.SUPPORTED_LANGUAGES
        ]
        total = 0
        distribution = {"low": 0, "medium": 0, "high": 0}
        file_metrics = []

        for entry in eligible:
            complexity = entry.get("complexity", 1)
            total += complexity
            risk = cls.categorize_risk(complexity)
            if risk == "healthy":
                distribution["low"] += 1
            elif risk == "warning":
                distribution["medium"] += 1
            else:
                distribution["high"] += 1
            file_metrics.append({"file": entry["path"], "complexity": complexity, "risk": risk})

        file_metrics.sort(key=lambda item: item["complexity"], reverse=True)
        average = round(total / len(eligible), 2) if eligible else 0
        return {
            "total": total,
            "average": average,
            "analyzedFileCount": len(eligible),
            "excludedFileCount": len(files) - len(eligible),
            "distribution": distribution,
            "highestComplexityFiles": file_metrics[:10],
        }
