export interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  id: string;
  u: string; // vertex id
  v: string; // vertex id
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
}

export interface DegreeInfo {
  vertexId: string;
  label: string;
  degree: number;
  isEven: boolean;
  isIsolated: boolean;
}

export interface EulerResult {
  isEulerian: boolean;         // Có chu trình Euler
  hasEulerTrail: boolean;       // Có đường đi Euler (nhưng không có chu trình)
  reason: string;
  oddDegreeVertices: string[];  // Danh sách nhãn các đỉnh bậc lẻ
  isConnectedNonIsolated: boolean;
  connectedComponentsCount: number;
  cycle?: string[];             // Danh sách nhãn đỉnh trong chu trình
  trail?: string[];             // Danh sách nhãn đỉnh trong đường đi
  edgesSequence?: { u: string; v: string }[];
  specialCaseNote?: string;
  startVertex?: string;
}

export interface HamiltonResult {
  isHamiltonian: boolean;
  searchCompleted: boolean;     // Phân biệt duyệt hết vs dừng sớm do quá tải
  reason: string;
  cycle?: string[];             // Danh sách nhãn đỉnh (VD: A -> B -> C -> D -> A)
  totalStatesExplored: number;
  executionTimeMs: number;
  startVertex?: string;
  specialCaseNote?: string;
}

export type StepActionType = 
  | 'start'
  | 'choose_edge'
  | 'hierholzer_subcycle'
  | 'hierholzer_splice'
  | 'euler_done'
  | 'hamilton_try'
  | 'hamilton_success'
  | 'hamilton_backtrack'
  | 'hamilton_done'
  | 'deadend'
  | 'info';

export interface AlgorithmStep {
  stepIndex: number;
  algorithmType: 'euler' | 'hamilton';
  actionType: StepActionType;
  title: string;
  description: string;
  activeVertexId?: string;
  targetVertexId?: string;
  activeEdgeId?: string;
  visitedVertexIds: string[];
  traversedEdgeIds: string[];
  backtrackedEdgeIds?: string[];
  currentPath: string[]; // Danh sách nhãn
  stackDisplay?: string[];
  cycleHighlight?: string[];
}

export interface PresetGraph {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedEuler: string;
  expectedHamilton: string;
  vertices: { id: string; label: string; x: number; y: number }[];
  edges: { u: string; v: string }[];
}
