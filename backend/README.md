### `backend/README.md`
```markdown
# Backend Service

Flask-based REST service managing temporary repository ingestion, orchestration of static analyzers, and JSON report delivery.

## Key Files
* `app.py`: Route definitions (`/api/health`, `/api/analyze`, `/api/summary`, `/api/file-content`).
* `services/ingestion.py`: Safe archive unpacking and file discovery.
* `services/repository_service.py`: Workspace filesystem manager.
* `services/analysis_service.py`: Invoker bridging analyzer engine and Git.

## Execution
```bash
pip install -r requirements.txt
python app.py