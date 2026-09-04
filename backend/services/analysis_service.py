import os
from analyzer.engine import StaticAnalysisEngine
from git_engine.history import analyze_git_repository

class AnalysisService:
    @staticmethod
    def execute(repo_path: str, repo_name: str) -> dict:
        engine = StaticAnalysisEngine(repo_path)
        analysis_data = engine.run()
        git_data = analyze_git_repository(repo_path)

        analysis_data["repository"] = {
            "name": repo_name,
            "path": repo_path,
            "hasGit": git_data.get("available", False)
        }
        analysis_data["git"] = git_data
        return analysis_data
