import React from 'react';
import {
  LayoutDashboard, Network, GitBranch, Layers,
  HeartPulse, GitCommit, Search, X,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, hasData, isOpen, isCollapsed, onClose, onToggleCollapse }) {
  const navs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'dependencies', label: 'Dependencies', icon: Network },
    { id: 'flows', label: 'Feature Flows', icon: GitBranch },
    { id: 'git', label: 'Git History', icon: GitCommit },
    { id: 'health', label: 'Code Health', icon: HeartPulse },
    { id: 'search', label: 'Search', icon: Search }
  ];

  const handleNavigation = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img src="/logo.png" alt="Archaeologist" className="sidebar-logo" />
        <span>ARCHAEOLOGIST</span>
        <button
          className="sidebar-close"
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-header">
          <span className="nav-section-title">ANALYSIS</span>
          <button
            className="sidebar-collapse-toggle"
            type="button"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
        </div>
        {navs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              disabled={!hasData && item.id !== 'overview'}
              onClick={() => handleNavigation(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={16} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
