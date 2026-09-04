class CallGraphBuilder:
    @staticmethod
    def build(parsed_files: list[dict]) -> list[dict]:
        relationships = []
        symbol_index = {}

        for pf in parsed_files:
            for s in pf.get("symbols", []):
                symbol_index[s["name"]] = {
                    "file": pf["path"],
                    "line": s.get("line"),
                    "kind": s.get("kind")
                }

        for pf in parsed_files:
            file_path = pf["path"]
            for call in pf.get("calls", []):
                target = call["target"]
                if target in symbol_index:
                    meta = symbol_index[target]
                    relationships.append({
                        "source": file_path,
                        "sourceLine": call["line"],
                        "target": meta["file"],
                        "targetSymbol": target,
                        "targetKind": meta["kind"],
                        "relationship": "calls",
                        "confidence": 0.90 if meta["file"] != file_path else 1.0
                    })

        return relationships
