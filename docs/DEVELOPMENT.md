# Development Guide

## Requirements

- Python 3.10+
- Node.js 18+
- npm

## Backend

From the repository root:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
python -m backend.app
```

The Flask API listens on `http://127.0.0.1:5000`.

## Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite runs on port 3000 and proxies `/api` requests to the local Flask server.

## Tests

From the repository root, with backend dependencies installed:

```bash
python -m pytest -q
```

## Implementation notes

- Repository switches are transactional: the active workspace is replaced only after clone and analysis succeed.
- Search reads only files indexed in the active repository.
- Architecture links are derived from parser imports; unresolved imports are reported separately.
- The health score is size-neutral and reports when duplication data is unavailable. Simulator values are hypothetical only.
- Keep GitHub operations read-only during local development; do not push or deploy without the project owner's explicit decision.
