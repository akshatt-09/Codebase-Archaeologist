import React from 'react';
import { Activity } from 'lucide-react';
import { RepositoryUploader } from '../repository/RepositoryUploader';

export function Navbar({ repoName, onUpload, loading }) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Activity size={18} color="#0ea5e9" />
        <span style={{ fontWeight: 600, color: '#f0f4fc' }}>
          {repoName || 'No Repository Selected'}
        </span>
      </div>
      <RepositoryUploader onUpload={onUpload} loading={loading} />
    </header>
  );
}