import React from 'react';
import { DegreeInfo, Edge, Vertex } from '../types/graph';
interface DegreeTableProps {
    vertices: Vertex[];
    edges: Edge[];
    degrees: DegreeInfo[];
    onDeleteVertex?: (vertexId: string) => void;
    onDeleteEdge?: (edgeId: string) => void;
}
export declare const DegreeTable: React.FC<DegreeTableProps>;
export {};
//# sourceMappingURL=DegreeTable.d.ts.map