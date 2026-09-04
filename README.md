# Codebase Archaeologist

Codebase Archaeologist is a developer intelligence platform that statically analyzes real software repositories to extract architectural boundaries, call graphs, dependency trees, complexity metrics, and code health indicators.

## Architecture Pipeline

```text
Upload (Folder / ZIP)
  ↓
Secure Ingestion (Zip Slip prevention, binary filtering)
  ↓
Language Detection & Lexical/AST Parsing
  ↓
Dependency Graph Resolution & Module Inference
  ↓
Complexity (Cyclomatic) & Code Health Scoring
  ↓
Git Metadata Extraction (GitPython)
  ↓
Normalized JSON Response
  ↓
React Dashboard

cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py

Runs at http://127.0.0.1:5000.

cd frontend
npm install
npm run dev

Runs at http://127.0.0.1:3000.