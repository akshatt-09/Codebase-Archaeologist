from collections import defaultdict


class ArchitectureInference:
    @staticmethod
    def infer_modules(files: list[dict], edges: list[dict]) -> dict:
        modules = {}
        file_to_module = {}
        for file_entry in files:
            path = file_entry["path"]
            parts = path.split("/")
            module_name = parts[0] if len(parts) > 1 else "root"
            file_to_module[path] = module_name
            module = modules.setdefault(module_name, {
                "name": module_name, "files": [], "languages": set(),
                "incomingCount": 0, "outgoingCount": 0, "fileEdges": [],
            })
            module["files"].append(path)
            if file_entry.get("language"):
                module["languages"].add(file_entry["language"])

        cross_counts = defaultdict(int)
        module_edges = []
        for edge in edges:
            source, target = edge.get("from"), edge.get("to")
            src_module = file_to_module.get(source)
            dst_module = file_to_module.get(target)
            if not src_module or not dst_module:
                continue
            modules[src_module]["outgoingCount"] += 1
            modules[dst_module]["incomingCount"] += 1
            if src_module == dst_module:
                modules[src_module]["fileEdges"].append(edge)
            else:
                aggregate = cross_counts[(src_module, dst_module)]
                if not isinstance(aggregate, dict):
                    aggregate = {"count": 0, "dynamicCount": 0}
                    cross_counts[(src_module, dst_module)] = aggregate
                aggregate["count"] += 1
                if edge.get("dynamic"):
                    aggregate["dynamicCount"] += 1

        for (source, target), aggregate in sorted(cross_counts.items()):
            module_edges.append({"from": source, "to": target, **aggregate})

        adjacency = defaultdict(list)
        for edge in edges:
            adjacency[edge.get("from")].append(edge.get("to"))
        cycles = set()
        visited = set()
        for start_node in adjacency:
            if start_node in visited:
                continue
            path = [start_node]
            positions = {start_node: 0}
            stack = [(start_node, iter(adjacency.get(start_node, [])))]
            while stack:
                node, targets = stack[-1]
                try:
                    target = next(targets)
                except StopIteration:
                    stack.pop()
                    positions.pop(node, None)
                    visited.add(node)
                    path.pop()
                    continue
                if target in positions:
                    cycle = path[positions[target]:]
                    if len(cycle) > 1 or target == node:
                        cycles.add(tuple(sorted(cycle)))
                elif target not in visited:
                    positions[target] = len(path)
                    path.append(target)
                    stack.append((target, iter(adjacency.get(target, []))))

        for module in modules.values():
            module["languages"] = sorted(module["languages"])
            module["description"] = f"Top-level project area containing {len(module['files'])} discovered file(s)."

        return {
            "modules": list(modules.values()),
            "crossModuleEdges": module_edges,
            "fileEdges": edges,
            "circularDependencies": [list(cycle) for cycle in sorted(cycles)],
        }
