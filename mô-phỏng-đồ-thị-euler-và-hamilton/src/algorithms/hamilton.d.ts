import { GraphData, HamiltonAnalysis, SimulationStep } from '../types/graph';
/**
 * Phân tích lý thuyết tính chất Hamilton của đồ thị
 */
export declare function analyzeHamilton(graph: GraphData): {
    analysis: HamiltonAnalysis;
};
/**
 * Thuật toán Quay lui (Backtracking) tìm Chu trình Hamilton
 * Sinh chi tiết từng bước mô phỏng
 */
export declare function runHamiltonSimulation(graph: GraphData): {
    steps: SimulationStep[];
    cycleVertexIds: string[];
    cycleLabels: string[];
    cycleEdgeIds: string[];
    hasCycle: boolean;
    analysis: HamiltonAnalysis;
};
//# sourceMappingURL=hamilton.d.ts.map