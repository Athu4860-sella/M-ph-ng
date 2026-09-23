import React from 'react';
import { GraphData, SimulationStep, DegreeInfo } from '../types/graph';
interface GraphCanvasProps {
    graph: GraphData;
    degrees: DegreeInfo[];
    currentStep?: SimulationStep;
    activeAlgorithm: 'euler' | 'hamilton' | null;
    onUpdateGraph: (newGraph: GraphData) => void;
    onResetSimulation: () => void;
}
export declare const GraphCanvas: React.FC<GraphCanvasProps>;
export {};
//# sourceMappingURL=GraphCanvas.d.ts.map