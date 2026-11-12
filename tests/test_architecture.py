from analyzer.graph.architecture import ArchitectureInference

def test_architecture_module_inference():
    files = [
        {"path": "backend/app.py", "language": "Python"},
        {"path": "backend/models.py", "language": "Python"},
        {"path": "frontend/index.js", "language": "JavaScript"}
    ]
    edges = [
        {"from": "frontend/index.js", "to": "backend/app.py"}
    ]
    arch = ArchitectureInference.infer_modules(files, edges)
    module_names = [m["name"] for m in arch["modules"]]

    assert "backend" in module_names
    assert "frontend" in module_names
    assert len(arch["crossModuleEdges"]) == 1
    assert arch["crossModuleEdges"][0]["from"] == "frontend"
    assert arch["crossModuleEdges"][0]["to"] == "backend"


def test_architecture_contains_file_edges_and_cycles():
    files = [
        {"path": "pkg/a.py", "language": "Python"},
        {"path": "pkg/b.py", "language": "Python"},
        {"path": "pkg/c.py", "language": "Python"},
    ]
    edges = [
        {"from": "pkg/a.py", "to": "pkg/b.py", "line": 2},
        {"from": "pkg/b.py", "to": "pkg/a.py", "line": 3},
        {"from": "pkg/c.py", "to": "pkg/a.py", "line": 1},
    ]
    architecture = ArchitectureInference.infer_modules(files, edges)
    assert architecture["fileEdges"] == edges
    assert len(architecture["circularDependencies"]) == 1
    assert set(architecture["circularDependencies"][0]) == {"pkg/a.py", "pkg/b.py"}


def test_cross_module_edges_aggregate_static_and_dynamic_counts():
    files = [
        {"path": "frontend/app.js", "language": "JavaScript"},
        {"path": "backend/api.js", "language": "JavaScript"},
    ]
    edges = [
        {"from": "frontend/app.js", "to": "backend/api.js", "dynamic": False},
        {"from": "frontend/app.js", "to": "backend/api.js", "dynamic": True},
    ]
    architecture = ArchitectureInference.infer_modules(files, edges)
    assert architecture["crossModuleEdges"][0]["count"] == 2
    assert architecture["crossModuleEdges"][0]["dynamicCount"] == 1
