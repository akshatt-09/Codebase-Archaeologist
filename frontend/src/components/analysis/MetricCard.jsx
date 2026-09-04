import React from 'react';

export function MetricCard({ label, value, color = 'var(--text-primary)' }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-val" style={{ color }}>{value}</div>
    </div>
  );
}