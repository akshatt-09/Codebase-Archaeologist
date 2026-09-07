import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Overview } from './pages/Overview';
import { Architecture } from './pages/Architecture';
import { Dependencies } from './pages/Dependencies';
import { FeatureFlows } from './pages/FeatureFlows';
import { GitHistory } from './pages/GitHistory';
import { CodeHealth } from './pages/CodeHealth';
import { Search } from './pages/Search';
import { useAnalysis } from './hooks/useAnalysis';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [gitUrl, setGitUrl] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data, loading, analyzingStep, error, runAnalysis, runGithubAnalysis } = useAnalysis();

  const handleGitSubmit = (e) => {
    e.preventDefault();
    if (gitUrl.trim() && runGithubAnalysis) {
      runGithubAnalysis(gitUrl.trim());
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="empty-state">
          <h2>Analyzing Repository...</h2>
          <p style={{ marginTop: '8px', color: '#0ea5e9' }}>{analyzingStep}</p>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="empty-state" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', justifyContent: 'flex-start', paddingTop: 'clamp(48px, 10vh, 96px)' }}>
          <h2 style={{ marginTop: 0 }}>Analyze a Codebase</h2>
          <p style={{ marginTop: '10px', color: '#94a3b8', maxWidth: '500px' }}>
            Explore any public GitHub repository or upload your project to understand its architecture, dependencies, and code health.
          </p>

          <form onSubmit={handleGitSubmit} style={{ display: 'flex', gap: '8px', marginTop: '24px', width: '100%' }}>
            <input
              type="url"
              placeholder="https://github.com/owner/repository"
              value={gitUrl}
              onChange={(e) => setGitUrl(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !gitUrl.trim()}
              style={{
                padding: '10px 18px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Analyze
            </button>
          </form>

          {error && <p style={{ color: '#ef4444', marginTop: '16px' }}>{error}</p>}
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': return <Overview data={data} />;
      case 'architecture': return <Architecture data={data} />;
      case 'dependencies': return <Dependencies data={data} />;
      case 'flows': return <FeatureFlows data={data} />;
      case 'git': return <GitHistory data={data} />;
      case 'health': return <CodeHealth data={data} />;
      case 'search': return <Search data={data} />;
      default: return <Overview data={data} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasData={!!data}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <div className="main-wrapper">
        <Header
          repoName={data?.repository?.name}
          onUpload={runAnalysis}
          loading={loading}
          onSidebarToggle={() => setSidebarOpen((open) => !open)}
        />
        <main className="content-pane">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
