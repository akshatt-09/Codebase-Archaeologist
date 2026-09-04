import React from 'react';
import { ArchitectureGraph } from '../components/graphs/ArchitectureGraph';

export function Architecture({ data }) {
  return (
    <div>
      <ArchitectureGraph architecture={data?.architecture} />
    </div>
  );
}