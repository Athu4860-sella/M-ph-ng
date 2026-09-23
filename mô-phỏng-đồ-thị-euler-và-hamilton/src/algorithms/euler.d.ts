import { GraphData, EulerAnalysis, SimulationStep } from '../types/graph';
/**
 * Phân tích tính chất Euler của đồ thị
 */
export declare function analyzeEuler(graph: GraphData): EulerAnalysis;
/**
 * Thuật toán Hierholzer tìm Chu trình hoặc Đường đi Euler
 * Trả về danh sách đầy đủ các bước mô phỏng
 */
export declare function runHierholzerSimulation(graph: GraphData): {
    steps: SimulationStep[];
    tourVertexIds: string[];
    tourLabels: string[];
    tourEdgeIds: string[];
};
//# sourceMappingURL=euler.d.ts.map