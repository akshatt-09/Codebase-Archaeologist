import React from 'react';
import { SEVERITY_BADGES } from '../../utils/constants';

export function Badge({ type = 'neutral', children }) {
  const cls = SEVERITY_BADGES[type] || 'badge-neutral';
  return <span className={`badge ${cls}`}>{children}</span>;
}