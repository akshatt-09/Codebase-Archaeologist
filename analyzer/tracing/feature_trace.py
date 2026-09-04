import os
class FeatureFlowEngine:
    @staticmethod
    def infer_flows(parsed_files: list[dict], edges: list[dict]) -> list[dict]:
        flows = []
        
        # Identify plausible entry files (Pages, Controllers, App, Main)
        entry_points = []
        for pf in parsed_files:
            p_lower = pf["path"].lower()
            if any(term in p_lower for term in ['page', 'controller', 'view', 'app.', 'main.', 'index.']):
                entry_points.append(pf["path"])

        adjacency = {}
        for edge in edges:
            adjacency.setdefault(edge["from"], []).append(edge["to"])

        for entry in entry_points:
            visited = []
            curr = entry
            steps = []
            
            while curr and curr not in visited and len(visited) < 5:
                visited.append(curr)
                steps.append({
                    "file": curr,
                    "step": len(steps) + 1
                })
                neighbors = adjacency.get(curr, [])
                curr = neighbors[0] if neighbors else None

            if len(steps) > 1:
                flows.append({
                    "id": f"flow_{len(flows)+1}",
                    "name": f"Flow: {os.path.basename(entry)} Path",
                    "entryPoint": entry,
                    "steps": steps,
                    "confidence": 0.85
                })

        return flows

