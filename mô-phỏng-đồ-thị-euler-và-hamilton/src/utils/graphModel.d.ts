import { GraphData, Vertex, Edge, DegreeInfo } from '../types/graph';
/**
 * Sinh nhãn tự động cho đỉnh: A, B, C... Z, A1, B1...
 */
export declare function generateVertexLabel(index: number): string;
/**
 * Kiểm tra xem cạnh u-v đã tồn tại chưa (vô hướng, u !== v)
 */
export declare function edgeExists(edges: Edge[], uId: string, vId: string): boolean;
/**
 * Tìm ID của cạnh nối giữa u và v
 */
export declare function findEdgeId(edges: Edge[], uId: string, vId: string): string | undefined;
/**
 * Xây dựng danh sách kề cho đồ thị vô hướng
 */
export declare function buildAdjacencyList(graph: GraphData): Map<string, string[]>;
/**
 * Tính bậc và thông tin chi tiết của tất cả các đỉnh
 */
export declare function calculateDegrees(graph: GraphData): DegreeInfo[];
/**
 * Tìm các thành phần liên thông sử dụng BFS
 * @param graph Đồ thị
 * @param nonZeroOnly Chỉ xét các đỉnh có bậc > 0
 */
export declare function findConnectedComponents(graph: GraphData, nonZeroOnly?: boolean): string[][];
/**
 * Tự động sắp xếp các đỉnh theo hình tròn đẹp mắt
 */
export declare function applyCircularLayout(vertices: Vertex[], width?: number, height?: number, padding?: number): Vertex[];
/**
 * Phân tích danh sách cạnh từ văn bản
 * Hỗ trợ các định dạng:
 * "A B"
 * "A - B"
 * "A, B"
 * "(A, B)"
 * "1 2\n2 3"
 */
export declare function parseEdgeList(input: string, width?: number, height?: number): {
    graph?: GraphData;
    error?: string;
};
/**
 * Xuất đồ thị ra định dạng danh sách cạnh text
 */
export declare function exportToEdgeList(graph: GraphData): string;
//# sourceMappingURL=graphModel.d.ts.map