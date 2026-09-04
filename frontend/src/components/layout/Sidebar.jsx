import React from 'react';
import { 
  LayoutDashboard, Network, GitBranch, Layers, 
  HeartPulse, GitCommit, Search, ShieldCheck 
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, hasData }) {
  const navs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'dependencies', label: 'Dependencies', icon: Network },
    { id: 'flows', label: 'Feature Flows', icon: GitBranch },
    { id: 'git', label: 'Git History', icon: GitCommit },
    { id: 'health', label: 'Code Health', icon: HeartPulse },
    { id: 'search', label: 'Search', icon: Search }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <ShieldCheck size={20} color="#0ea5e9" />
        <span>ARCHAEOLOGIST</span>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-title">ANALYSIS</div>
        {navs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              disabled={!hasData && item.id !== 'overview'}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}