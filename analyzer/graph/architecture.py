import os

class ArchitectureInference:
    @staticmethod
    def infer_modules(files: list[dict], edges: list[dict]) -> dict:
        modules = {}
        
        for f in files:
            p = f["path"]
            parts = p.split('/')
            module_name = parts[0] if len(parts) > 1 else "root"
            
            if module_name not in modules:
                modules[module_name] = {
                    "name": module_name,
                    "files": [],
                    "languages": set(),
                    "incomingCount": 0,
                    "outgoingCount": 0
                }
            modules[module_name]["files"].append(p)
            if f.get("language"):
                modules[module_name]["languages"].add(f["language"])

        # Determine inter-module edge boundaries
        module_edges = []
        for e in edges:
            src = e["from"].split('/')[0] if '/' in e["from"] else "root"
            tgt = e["to"].split('/')[0] if '/' in e["to"] else "root"
            if src in modules:
                modules[src]["outgoingCount"] += 1
            if tgt in modules:
                modules[tgt]["incomingCount"] += 1
            if src != tgt:
                module_edges.append({"from": src, "to": tgt})

        for m in modules.values():
            m["languages"] = list(m["languages"])

        return {
            "modules": list(modules.values()),
            "crossModuleEdges": module_edges
        }
