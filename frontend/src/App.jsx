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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inspectionTarget, setInspectionTarget] = useState(null);
  const { data, loading, analyzingStep, error, runAnalysis, runGithubAnalysis } = useAnalysis();

  const renderContent = () => {
    if (!data) {
      return (
        <div className="empty-state" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', justifyContent: 'flex-start', paddingTop: 'clamp(48px, 10vh, 96px)' }}>
          <h2 style={{ marginTop: 0 }}>Analyze a Codebase</h2>
          <p style={{ marginTop: '10px', color: '#94a3b8', maxWidth: '500px' }}>
            Explore any public GitHub repository or upload your project to understand its architecture, dependencies, and code health.
          </p>

          <p style={{ marginTop: '22px', color: '#64748b' }}>Paste a GitHub repository URL in the header, or upload a ZIP/folder to begin.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview': return <Overview data={data} />;
      case 'architecture': return <Architecture data={data} />;
      case 'dependencies': return <Dependencies data={data} />;
      case 'flows': return <FeatureFlows data={data} />;
      case 'git': return <GitHistory data={data} />;
      case 'health': return <CodeHealth data={data} onInspect={(file, line) => { setInspectionTarget({ file, line, key: Date.now() }); setActiveTab('search'); }} />;
      case 'search': return <Search data={data} inspectionTarget={inspectionTarget} />;
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
          onGithubAnalyze={runGithubAnalysis}
          loading={loading}
          onSidebarToggle={() => setSidebarOpen((open) => !open)}
        />
        <main className="content-pane">
          {loading && <div className="analysis-status" role="status">{analyzingStep || 'Analyzing repository…'} — your previous successful analysis remains available.</div>}
          {error && <div className="analysis-error" role="alert">{error}</div>}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
