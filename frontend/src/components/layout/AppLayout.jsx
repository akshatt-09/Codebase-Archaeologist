import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppLayout({ activeTab, setActiveTab, hasData, repoName, onUpload, loading, children }) {
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} hasData={hasData} />
      <div className="main-wrapper">
        <Navbar repoName={repoName} onUpload={onUpload} loading={loading} />
        <main className="content-pane">{children}</main>
      </div>
    </div>
  );
}