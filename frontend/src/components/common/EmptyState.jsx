import React from 'react';
import { Layers } from 'lucide-react';

export function EmptyState({ title = "No repository analyzed", description = "Upload a repository to begin exploring." }) {
  return (
    <div className="empty-state">
      <Layers size={48} color="#64748b" />
      <h2>{title}</h2>
      <p style={{ marginTop: '8px' }}>{description}</p>
    </div>
  );
}