import { useState, useMemo } from 'react';

export function useRepository(data) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const files = useMemo(() => data?.files || [], [data]);
  const symbols = useMemo(() => data?.symbols || [], [data]);
  const architecture = useMemo(() => data?.architecture || { modules: [], crossModuleEdges: [] }, [data]);

  return {
    selectedFile,
    setSelectedFile,
    selectedModule,
    setSelectedModule,
    files,
    symbols,
    architecture
  };
}