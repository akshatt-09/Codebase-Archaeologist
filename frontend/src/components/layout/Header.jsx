import React, { useRef } from 'react';
import { Upload, FolderUp, Activity } from 'lucide-react';

export function Header({ repoName, onUpload, loading }) {
  const zipInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      onUpload(fd);
    }
  };

  const handleFolderChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append('files[]', files[i]);
      }
      onUpload(fd);
    }
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Activity size={18} color="#0ea5e9" />
        <span style={{ fontWeight: 600, color: '#f0f4fc' }}>
          {repoName ? repoName : 'No Repository Selected'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="file"
          ref={zipInputRef}
          style={{ display: 'none' }}
          accept=".zip"
          onChange={handleZipChange}
        />
        <input
          type="file"
          ref={folderInputRef}
          style={{ display: 'none' }}
          webkitdirectory=""
          directory=""
          onChange={handleFolderChange}
        />
        <button
          className="nav-item"
          style={{ background: '#181c24', border: '1px solid #262c38' }}
          disabled={loading}
          onClick={() => zipInputRef.current.click()}
        >
          <Upload size={14} /> Upload ZIP
        </button>
        <button
          className="nav-item"
          style={{ background: '#181c24', border: '1px solid #262c38' }}
          disabled={loading}
          onClick={() => folderInputRef.current.click()}
        >
          <FolderUp size={14} /> Upload Folder
        </button>
      </div>
    </header>
  );
}