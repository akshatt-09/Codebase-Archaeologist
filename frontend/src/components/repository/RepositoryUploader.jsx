import React, { useRef } from 'react';
import { Upload, FolderUp } from 'lucide-react';
import { Button } from '../common/Button';

export function RepositoryUploader({ onUpload, loading }) {
  const zipInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleZip = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      onUpload(fd);
    }
  };

  const handleFolder = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) fd.append('files[]', files[i]);
      onUpload(fd);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input type="file" ref={zipInputRef} style={{ display: 'none' }} accept=".zip" onChange={handleZip} />
      <input type="file" ref={folderInputRef} style={{ display: 'none' }} webkitdirectory="" directory="" onChange={handleFolder} />
      <Button variant="secondary" icon={Upload} disabled={loading} onClick={() => zipInputRef.current.click()}>
        Upload ZIP
      </Button>
      <Button variant="secondary" icon={FolderUp} disabled={loading} onClick={() => folderInputRef.current.click()}>
        Upload Folder
      </Button>
    </div>
  );
}