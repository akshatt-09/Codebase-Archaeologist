import React, { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';

export function FileExplorer({ files, onSelectFile }) {
  const [search, setSearch] = useState('');
  
  const filtered = files.filter(f => f.path.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <input
        type="text"
        placeholder="Filter files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          background: '#12151b',
          border: '1px solid #262c38',
          color: '#f0f4fc',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '12px'
        }}
      />
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.map((f) => (
          <div
            key={f.path}
            onClick={() => onSelectFile(f.path)}
            style={{
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '4px',
              fontSize: '13px',
              color: '#94a3b8'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#181c24')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <File size={14} color="#0ea5e9" />
            <span>{f.path}</span>
          </div>
        ))}
      </div>
    </div>
  );
}