# 🏛️ Codebase Archaeologist

**Codebase Archaeologist** is a full-stack developer tool for exploring and understanding unfamiliar software repositories.

Instead of manually opening dozens of files, developers can provide a **public GitHub repository, ZIP archive, or local folder** and inspect the codebase through a structured analysis dashboard.

> **Give it a codebase. Understand what is inside.**

## ✨ What It Does

- 🔗 Analyze public GitHub repositories
- 📦 Upload a repository as a ZIP archive
- 📁 Upload a local project folder
- 🏗️ Explore repository architecture and module structure
- 🔗 Inspect dependency relationships
- 🔄 Explore feature and code flows
- 📜 Review Git history and repository activity
- ❤️ Inspect code-health and complexity metrics
- 🔎 Search analyzed files and inspect source code
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

```bash
cd backend
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

Install dependencies:

```bash
pip install -r requirements.txt
```

Start Flask:

```bash
python app.py
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

- GitHub analysis currently targets public HTTPS GitHub repositories
- Analysis state is currently maintained by the running backend service
- Very large repositories may require additional performance and resource optimizations
- Some analysis capabilities are still being expanded

## 📌 Project Status

**Status: Active Development 🚧**

The core application, repository ingestion, backend analysis APIs, and deployed dashboard are working. Additional analysis depth and developer-facing features are being added incrementally.

## 👨‍💻 Author

**Akshatt**

GitHub: https://github.com/akshatt-09

---

⭐ If you find the project interesting, consider giving the repository a star.