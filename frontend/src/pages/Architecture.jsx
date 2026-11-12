import React from 'react';
import { ArchitectureGraph } from '../components/graphs/ArchitectureGraph';

export function Architecture({ data }) {
  return <ArchitectureGraph key={data?.repository?.path || data?.repository?.name} architecture={data?.architecture} files={data?.files || []} />;
}
