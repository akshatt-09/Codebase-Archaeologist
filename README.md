# 🏛️ Codebase Archaeologist

**Codebase Archaeologist** is a full-stack developer tool for exploring and understanding unfamiliar software repositories.

Instead of manually opening dozens of files, developers can provide a **public GitHub repository, ZIP archive, or local folder** and inspect the codebase through a structured analysis dashboard.

> **Give it a codebase. Understand what is inside.**

## ✨ What It Does

- 🔗 Analyze public GitHub repositories
- 📦 Upload a repository as a ZIP archive
- 📁 Upload a local project folder
- 🔁 Switch between GitHub repositories without losing the last successful analysis on a failed switch
- 🏗️ Explore module-level and file-level dependency diagrams with detected cycles
- 🔗 Inspect resolved, external, and unresolved dependency relationships
- 🔄 Explore feature and code flows
- 📜 Review Git history and repository activity
- ❤️ Inspect a size-neutral code-health score, findings, and a transparent score simulator
- 🔎 Search symbols, file paths, and actual source-code lines, then inspect matching source locations
- 📊 Present analysis through a developer-focused dashboard

## 🧩 How It Works

```text
GitHub URL / ZIP / Folder
          ↓
     Repository Ingestion
          ↓
 Language & File Detection
          ↓
 Repository Analysis
          ↓
 Architecture + Dependencies
          ↓
 Feature Flows + Code Health
          ↓
 Git Metadata & History
          ↓
      JSON API Response
          ↓
      React Dashboard
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- JavaScript / JSX
- Lucide React
- CSS

### Backend
- Python
- Flask
- Flask-CORS
- GitPython
- Repository analysis services

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

## 📁 Project Structure

```text
Codebase-Archaeologist/
├── analyzer/             # Repository analysis logic
├── backend/              # Flask API and backend services
│   ├── routes/
│   └── services/
├── frontend/             # React + Vite dashboard
│   └── src/
├── git_engine/           # Git-related analysis
├── tests/                 # Project tests
├── docs/                  # Project documentation
├── LICENSE.txt
└── README.md
```

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/akshatt-09/Codebase-Archaeologist.git
cd Codebase-Archaeologist
```

### 2. Start the backend

Run these commands from the project root:

```bash
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Install dependencies and start Flask:

```bash
pip install -r backend/requirements.txt
python -m backend.app
```

Backend runs at:

```text
http://127.0.0.1:5000
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Backend health check |
| `/api/summary` | GET | Retrieve the current analysis |
| `/api/analyze` | POST | Analyze an uploaded ZIP or folder |
| `/api/analyze-github` | POST | Clone and analyze a public GitHub repository |
| `/api/file-content` | GET | Retrieve source code from an analyzed file |
| `/api/search?q=term` | GET | Search active-repository symbols, file paths, and source lines |
| `/api/health-history` | GET | Retrieve score snapshots retained for the active repository during this backend session |

## 🌐 Live Demo

**Frontend:**

https://codebase-archaeologist-delta.vercel.app/

**Backend:**

https://codebase-archaeologist-backend-uohf.onrender.com

## 🎯 Why This Project?

Large codebases can be difficult to understand when joining an existing project or investigating an unfamiliar repository.

Codebase Archaeologist is designed around that problem: **turning a repository into an explorable map of its structure, relationships, history, and code health.**

The project focuses on practical developer tooling rather than a conventional CRUD application.

## 🔮 Future Improvements

Planned improvements include:

- More language-specific analysis
- Deeper AST-based analysis
- More detailed dependency graphs
- Improved feature-flow detection
- Advanced code-quality insights
- Persistent analysis sessions
- Private repository authentication
- AI-assisted architecture explanations
- Exportable analysis reports

## ⚠️ Current Limitations

This is an actively developed project. The current version is intended as a working developer-tool prototype and has limitations such as:

- GitHub analysis targets HTTPS GitHub repositories; private repositories need Git credentials available to the backend process
- Analysis state is maintained in memory by the running backend service
- Symbol discovery and dependency resolution are static-analysis approximations, not a full compiler/runtime model
- Test coverage remains unavailable unless a coverage source is integrated
- Repository analysis currently limits analyzable source to 20,000 files and 100MB total; individual files over 5MB are skipped
- Static symbol and dependency analysis is best-effort and may not resolve every language alias or runtime-loaded module

## 📌 Project Status

**Status: Active Development 🚧**

Repository switching, in-repository code search, the code-health score model and simulator, and interactive architecture exploration are implemented in this local development version. Verify the application locally before deploying any changes.

## 👨‍💻 Author

**Akshatt**

GitHub: https://github.com/akshatt-09

---

⭐ If you find the project interesting, consider giving the repository a star.