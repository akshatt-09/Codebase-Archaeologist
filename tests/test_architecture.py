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
