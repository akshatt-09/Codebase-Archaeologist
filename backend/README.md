# Backend Service

Flask REST API for repository ingestion, static analysis, repository search, and source delivery.

## Key files

- `app.py`: Flask application and route registration.
- `routes/analysis.py`: Analysis, repository switching, search, and source endpoints.
- `services/ingestion.py`: Safe archive extraction and repository file discovery.
- `services/repository_service.py`: Temporary workspace management.
- `services/search_service.py`: Symbol/path/source-line search.
- `services/source_service.py`: Bounded source preview windows with absolute line numbers.
- `utils/github.py`: Strict GitHub repository URL validation and normalization.
- `services/analysis_service.py`: Orchestration of static analysis and Git metadata.

## Execution

From the repository root:

```bash
pip install -r backend/requirements.txt
python -m backend.app
```
