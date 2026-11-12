import React, { useRef, useState } from 'react';
import { Upload, FolderUp, Activity, Menu, Github, Search } from 'lucide-react';

export function Header({ repoName, onUpload, onGithubAnalyze, loading, onSidebarToggle }) {
  const zipInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [repoUrl, setRepoUrl] = useState('');

  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      onUpload(fd);
      e.target.value = '';
    }
  };

  const handleFolderChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) fd.append('files[]', files[i]);
      onUpload(fd);
      e.target.value = '';
    }
  };

  const submitRepository = (event) => {
    event.preventDefault();
    if (repoUrl.trim()) onGithubAnalyze(repoUrl.trim());
  };

  return (
    <header className="top-header">
      <div className="header-repo">
        <button className="mobile-sidebar-toggle" type="button" aria-label="Open sidebar" onClick={onSidebarToggle}>
          <Menu size={20} />
        </button>
        <Activity size={18} color="#0ea5e9" />
        <span className="header-repo-name">{repoName || 'No Repository Selected'}</span>
      </div>
      <div className="header-actions">
        <form className="repository-switcher" onSubmit={submitRepository}>
          <Github size={15} />
          <input
            type="url"
            aria-label="GitHub repository URL"
            placeholder="https://github.com/owner/repository"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !repoUrl.trim()}><Search size={14} /> Analyze</button>
        </form>
        <input type="file" ref={zipInputRef} style={{ display: 'none' }} accept=".zip" onChange={handleZipChange} />
        <input type="file" ref={folderInputRef} style={{ display: 'none' }} webkitdirectory="" directory="" onChange={handleFolderChange} />
        <button className="nav-item header-upload" disabled={loading} onClick={() => zipInputRef.current.click()}><Upload size={14} /> Upload ZIP</button>
        <button className="nav-item header-upload" disabled={loading} onClick={() => folderInputRef.current.click()}><FolderUp size={14} /> Upload Folder</button>
      </div>
    </header>
  );
}
