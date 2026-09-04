import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ step = "Analyzing repository..." }) {
  return (
    <div className="empty-state">
      <Loader2 size={40} color="#0ea5e9" style={{ animation: 'spin 1s linear infinite' }} />
      <h2>Processing Codebase</h2>
      <p style={{ marginTop: '8px', color: '#0ea5e9' }}>{step}</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}