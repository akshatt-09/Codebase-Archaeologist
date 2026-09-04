import React from 'react';
import { AlertOctagon } from 'lucide-react';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="empty-state">
      <AlertOctagon size={48} color="#ef4444" />
      <h2 style={{ color: '#ef4444' }}>Analysis Failed</h2>
      <p style={{ marginTop: '8px', maxWidth: '400px' }}>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="nav-item" style={{ width: 'auto', marginTop: '16px', border: '1px solid #262c38' }}>
          Try Again
        </button>
      )}
    </div>
  );
}