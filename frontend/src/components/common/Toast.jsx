import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  const icons = {
    info: <CheckCircle size={16} color="#0ea5e9" />,
    warning: <AlertTriangle size={16} color="#f59e0b" />,
    error: <XCircle size={16} color="#ef4444" />
  };

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: '#181c24', border: '1px solid #262c38',
      borderRadius: '6px', padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1100
    }}>
      {icons[type]}
      <span style={{ fontSize: '13px', color: '#f0f4fc' }}>{message}</span>
    </div>
  );
}