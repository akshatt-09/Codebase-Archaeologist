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
  const { data, loading, analyzingStep, error, runAnalysis } = useAnalysis();

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
        <div className="empty-state">
          <h2>No repository analyzed</h2>
          <p style={{ marginTop: '8px' }}>
            Upload a repository folder or a ZIP file using the top header to begin exploration.
          </p>
          {error && <p style={{ color: '#ef4444', marginTop: '12px' }}>{error}</p>}
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
      />
      <div className="main-wrapper">
        <Header
          repoName={data?.repository?.name}
          onUpload={runAnalysis}
          loading={loading}
        />
        <main className="content-pane">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}