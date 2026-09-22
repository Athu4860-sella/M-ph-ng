import { 
  GraphData, 
  DegreeInfo, 
  EulerResult, 
  HamiltonResult, 
  AlgorithmStep,
  Edge 
} from '../types';

/**
 * Tìm id cạnh giữa 2 đỉnh u và v (vô hướng)
 */
export function findEdgeId(edges: Edge[], u: string, v: string): string | undefined {
  const edge = edges.find(
    e => (e.u === u && e.v === v) || (e.u === v && e.v === u)
  );
  return edge ? edge.id : undefined;
}

/**
 * Tính bậc của từng đỉnh trong đồ thị
 */
export function calculateDegrees(graph: GraphData): DegreeInfo[] {
  const degreeMap = new Map<string, number>();
  
  for (const v of graph.vertices) {
    degreeMap.set(v.id, 0);
  }
  
  for (const edge of graph.edges) {
    degreeMap.set(edge.u, (degreeMap.get(edge.u) || 0) + 1);
    degreeMap.set(edge.v, (degreeMap.get(edge.v) || 0) + 1);
  }
  
  return graph.vertices.map(v => {
    const deg = degreeMap.get(v.id) || 0;
    return {
      vertexId: v.id,
      label: v.label,
      degree: deg,
      isEven: deg % 2 === 0,
      isIsolated: deg === 0,
    };
  });
}

/**
 * Kiểm tra tính liên thông của các đỉnh có bậc > 0
 */
export function checkConnectedComponentsOfEdges(graph: GraphData): {
  isConnected: boolean;
  componentsCount: number;
  components: string[][]; // Danh sách các nhóm đỉnh (id)
} {
  const degrees = calculateDegrees(graph);
  const activeVertices = degrees.filter(d => d.degree > 0).map(d => d.vertexId);
  
  if (activeVertices.length <= 1) {
    return {
      isConnected: true,
      componentsCount: activeVertices.length === 0 ? 0 : 1,
      components: activeVertices.length === 0 ? [] : [[activeVertices[0]]],
    };
  }
  
  // Xây dựng danh sách kề cho các đỉnh có cạnh
  const adj = new Map<string, Set<string>>();
  for (const vId of activeVertices) {
    adj.set(vId, new Set<string>());
  }
  for (const edge of graph.edges) {
    adj.get(edge.u)?.add(edge.v);
    adj.get(edge.v)?.add(edge.u);
  }
  
  const visited = new Set<string>();
  const components: string[][] = [];
  
  for (const startId of activeVertices) {
    if (!visited.has(startId)) {
      const currentComp: string[] = [];
      const queue: string[] = [startId];
      visited.add(startId);
      
      while (queue.length > 0) {
        const curr = queue.shift()!;
        currentComp.push(curr);
        
        const neighbors = adj.get(curr) || new Set();
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(currentComp);
    }
  }
  
  return {
    isConnected: components.length <= 1,
    componentsCount: components.length,
    components,
  };
}

/**
 * Kiểm tra tính chất Euler & Tìm chu trình/đường đi bằng Hierholzer
 */
export function analyzeEuler(graph: GraphData, preferredStartVertexId?: string): {
  result: EulerResult;
  steps: AlgorithmStep[];
} {
  const degrees = calculateDegrees(graph);
  const idToLabel = new Map(graph.vertices.map(v => [v.id, v.label]));
  const steps: AlgorithmStep[] = [];
  
  // Trường hợp đồ thị rỗng hoặc không có cạnh
  if (graph.vertices.length === 0) {
    return {
      result: {
        isEulerian: false,
        hasEulerTrail: false,
        reason: 'Đồ thị rỗng, không có đỉnh và không có cạnh.',
        oddDegreeVertices: [],
        isConnectedNonIsolated: true,
        connectedComponentsCount: 0,
      },
      steps: [],
    };
  }
  
  if (graph.edges.length === 0) {
    const isSingleVertex = graph.vertices.length === 1;
    return {
      result: {
        isEulerian: isSingleVertex,
        hasEulerTrail: isSingleVertex,
        reason: isSingleVertex 
          ? 'Đồ thị có 1 đỉnh duy nhất và 0 cạnh: Theo quy ước lý thuyết đồ thị, chu trình Euler rỗng đi qua 0 cạnh được coi là thỏa mãn.'
          : 'Đồ thị có đỉnh nhưng hoàn toàn không có cạnh nào (|E| = 0). Không tồn tại chu trình hay đường đi Euler có cạnh.',
        oddDegreeVertices: [],
        isConnectedNonIsolated: true,
        connectedComponentsCount: 0,
        cycle: isSingleVertex ? [graph.vertices[0].label] : undefined,
        specialCaseNote: 'Đồ thị không chứa cạnh nào.',
      },
      steps: [],
    };
  }
  
  // Kiểm tra liên thông của phần chứa cạnh
  const compInfo = checkConnectedComponentsOfEdges(graph);
  const oddVertices = degrees.filter(d => !d.isEven);
  const oddLabels = oddVertices.map(d => d.label);
  
  const isConnected = compInfo.isConnected;
  const isEulerian = isConnected && oddVertices.length === 0;
  const hasEulerTrail = isConnected && oddVertices.length === 2;
  
  let reason = '';
  if (!isConnected) {
    reason = `Phần đồ thị chứa cạnh không liên thông (phân rã thành ${compInfo.componentsCount} thành phần liên thông riêng biệt). Do đó không thể đi qua tất cả các cạnh.`;
  } else if (oddVertices.length === 0) {
    reason = `Phần đồ thị chứa cạnh liên thông và TẤT CẢ các đỉnh có bậc đều là BẬC CHẴN. Theo Định lý Euler, đồ thị có CHU TRÌNH EULER.`;
  } else if (oddVertices.length === 2) {
    reason = `Phần đồ thị chứa cạnh liên thông và có ĐÚNG 2 đỉnh bậc lẻ (${oddLabels.join(', ')}). Theo Định lý Euler, đồ thị có ĐƯỜNG ĐI EULER nhưng KHÔNG có Chu trình Euler.`;
  } else {
    reason = `Đồ thị có ${oddVertices.length} đỉnh bậc lẻ (${oddLabels.join(', ')}). Một đồ thị chỉ có chu trình Euler khi có 0 đỉnh bậc lẻ, và có đường đi Euler khi có đúng 2 đỉnh bậc lẻ.`;
  }
  
  const isolatedVertices = degrees.filter(d => d.isIsolated).map(d => d.label);
  let specialCaseNote: string | undefined;
  if (isolatedVertices.length > 0) {
    specialCaseNote = `Lưu ý: Đồ thị có ${isolatedVertices.length} đỉnh cô lập (${isolatedVertices.join(', ')}). Theo định nghĩa chuẩn, các đỉnh cô lập (bậc 0) không làm mất tính Euler trên tập cạnh của đồ thị.`;
  }
  
  // Nếu có chu trình hoặc đường đi, chạy thuật toán Hierholzer
  let cycle: string[] | undefined = undefined;
  let trail: string[] | undefined = undefined;
  let edgesSequence: { u: string; v: string }[] | undefined = undefined;
  
  if (isEulerian || hasEulerTrail) {
    // Xác định đỉnh xuất phát
    let startId = preferredStartVertexId;
    
    if (hasEulerTrail) {
      // Đường đi Euler bắt buộc phải bắt đầu ở 1 trong 2 đỉnh bậc lẻ
      if (!startId || !oddVertices.some(v => v.vertexId === startId)) {
        startId = oddVertices[0].vertexId;
      }
    } else {
      // Chu trình Euler: chọn đỉnh có bậc > 0
      const validStart = degrees.find(d => d.vertexId === startId && d.degree > 0);
      if (!validStart) {
        startId = degrees.find(d => d.degree > 0)?.vertexId;
      }
    }
    
    if (startId) {
      const hierholzerResult = runHierholzerWithSteps(graph, startId, isEulerian);
      steps.push(...hierholzerResult.steps);
      
      if (isEulerian) {
        cycle = hierholzerResult.pathLabels;
      } else {
        trail = hierholzerResult.pathLabels;
      }
      edgesSequence = hierholzerResult.edgesSequence;
      
      // Kiểm tra lại chu trình để bảo đảm tính đúng đắn trước khi hiển thị
      const valid = verifyEulerPath(graph, hierholzerResult.pathIds, isEulerian);
      if (!valid) {
        console.warn('Cảnh báo: Chu trình Euler tìm được không vượt qua khâu thẩm định tính đúng!');
      }
    }
  }
  
  return {
    result: {
      isEulerian,
      hasEulerTrail,
      reason,
      oddDegreeVertices: oddLabels,
      isConnectedNonIsolated: isConnected,
      connectedComponentsCount: compInfo.componentsCount,
      cycle,
      trail,
      edgesSequence,
      specialCaseNote,
      startVertex: preferredStartVertexId ? idToLabel.get(preferredStartVertexId) : undefined,
    },
    steps,
  };
}

/**
 * Thuật toán Hierholzer với ghi lại từng bước (Step-by-step trace)
 */
function runHierholzerWithSteps(
  graph: GraphData, 
  startId: string, 
  isCycle: boolean
): {
  pathIds: string[];
  pathLabels: string[];
  edgesSequence: { u: string; v: string }[];
  steps: AlgorithmStep[];
} {
  const idToLabel = new Map(graph.vertices.map(v => [v.id, v.label]));
  const steps: AlgorithmStep[] = [];
  let stepCount = 0;
  
  // Sao chép danh sách cạnh dạng đa cạnh vô hướng có id
  interface EdgeRef {
    id: string;
    target: string;
    used: boolean;
  }
  
  const adj = new Map<string, EdgeRef[]>();
  for (const v of graph.vertices) {
    adj.set(v.id, []);
  }
  
  for (const edge of graph.edges) {
    const ref1: EdgeRef = { id: edge.id, target: edge.v, used: false };
    const ref2: EdgeRef = { id: edge.id, target: edge.u, used: false };
    adj.get(edge.u)?.push(ref1);
    adj.get(edge.v)?.push(ref2);
  }
  
  steps.push({
    stepIndex: ++stepCount,
    algorithmType: 'euler',
    actionType: 'start',
    title: `Khởi đầu thuật toán Hierholzer`,
    description: `Bắt đầu tìm kiếm ${isCycle ? 'chu trình' : 'đường đi'} Euler từ đỉnh xuất phát ${idToLabel.get(startId)}. Đưa đỉnh này vào ngăn xếp (Stack).`,
    activeVertexId: startId,
    visitedVertexIds: [startId],
    traversedEdgeIds: [],
    currentPath: [idToLabel.get(startId)!],
    stackDisplay: [idToLabel.get(startId)!],
  });
  
  const stack: string[] = [startId];
  const finalCircuit: string[] = [];
  const traversedEdgeIds: string[] = [];
  const edgesSequence: { u: string; v: string }[] = [];
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = adj.get(current) || [];
    
    // Tìm cạnh kề đầu tiên chưa sử dụng
    const unusedEdge = neighbors.find(e => !e.used);
    
    if (unusedEdge) {
      // Đánh dấu cạnh đã dùng ở cả 2 chiều
      unusedEdge.used = true;
      const reverseList = adj.get(unusedEdge.target) || [];
      const reverseEdge = reverseList.find(e => e.id === unusedEdge.id && !e.used);
      if (reverseEdge) {
        reverseEdge.used = true;
      }
      
      const nextVertex = unusedEdge.target;
      stack.push(nextVertex);
      traversedEdgeIds.push(unusedEdge.id);
      edgesSequence.push({ u: current, v: nextVertex });
      
      steps.push({
        stepIndex: ++stepCount,
        algorithmType: 'euler',
        actionType: 'choose_edge',
        title: `Đi theo cạnh (${idToLabel.get(current)} - ${idToLabel.get(nextVertex)})`,
        description: `Từ đỉnh ${idToLabel.get(current)}, còn cạnh chưa thăm nối tới ${idToLabel.get(nextVertex)}. Di chuyển tới ${idToLabel.get(nextVertex)} và thêm vào ngăn xếp.`,
        activeVertexId: nextVertex,
        targetVertexId: current,
        activeEdgeId: unusedEdge.id,
        visitedVertexIds: Array.from(new Set(stack)),
        traversedEdgeIds: [...traversedEdgeIds],
        currentPath: stack.map(id => idToLabel.get(id)!),
        stackDisplay: stack.map(id => idToLabel.get(id)!),
      });
    } else {
      // Đỉnh không còn cạnh chưa duyệt nào nữa -> Lấy ra khỏi stack đưa vào chu trình cuối
      const popped = stack.pop()!;
      finalCircuit.push(popped);
      
      steps.push({
        stepIndex: ++stepCount,
        algorithmType: 'euler',
        actionType: 'hierholzer_splice',
        title: `Hết cạnh tại đỉnh ${idToLabel.get(popped)} -> Ghi nhận vào kết quả`,
        description: `Đỉnh ${idToLabel.get(popped)} không còn cạnh nào chưa đi qua. Rút đỉnh này ra khỏi ngăn xếp và đưa vào chuỗi chu trình Euler (ngược chiều ghép chu trình).`,
        activeVertexId: popped,
        visitedVertexIds: Array.from(new Set([...stack, ...finalCircuit])),
        traversedEdgeIds: [...traversedEdgeIds],
        currentPath: stack.map(id => idToLabel.get(id)!),
        stackDisplay: stack.map(id => idToLabel.get(id)!),
      });
    }
  }
  
  // Đảo ngược finalCircuit để được thứ tự duyệt đúng
  const pathIds = [...finalCircuit].reverse();
  const pathLabels = pathIds.map(id => idToLabel.get(id)!);
  
  steps.push({
    stepIndex: ++stepCount,
    algorithmType: 'euler',
    actionType: 'euler_done',
    title: `Hoàn tất thuật toán Hierholzer`,
    description: `Đã hoàn tất tìm ${isCycle ? 'chu trình' : 'đường đi'} Euler. Mọi cạnh đều được duyệt qua đúng một lần. Kết quả: ${pathLabels.join(' → ')}.`,
    activeVertexId: pathIds[0],
    visitedVertexIds: pathIds,
    traversedEdgeIds: traversedEdgeIds,
    currentPath: pathLabels,
    stackDisplay: [],
    cycleHighlight: pathLabels,
  });
  
  return {
    pathIds,
    pathLabels,
    edgesSequence,
    steps,
  };
}

/**
 * Kiểm định chu trình/đường đi Euler trước khi xuất kết quả
 */
function verifyEulerPath(graph: GraphData, pathIds: string[], isCycle: boolean): boolean {
  if (pathIds.length === 0) return false;
  if (isCycle && pathIds[0] !== pathIds[pathIds.length - 1]) return false;
  
  const usedEdgesCount = new Map<string, number>();
  for (let i = 0; i < pathIds.length - 1; i++) {
    const u = pathIds[i];
    const v = pathIds[i + 1];
    const edgeId = findEdgeId(graph.edges, u, v);
    if (!edgeId) return false; // Không có cạnh nối giữa u và v
    usedEdgesCount.set(edgeId, (usedEdgesCount.get(edgeId) || 0) + 1);
  }
  
  // Mỗi cạnh trong đồ thị phải xuất hiện đúng 1 lần
  for (const edge of graph.edges) {
    if (usedEdgesCount.get(edge.id) !== 1) {
      return false;
    }
  }
  return true;
}

/**
 * Thuật toán Quay lui (Backtracking) tìm Chu trình Hamilton
 */
export function analyzeHamilton(
  graph: GraphData,
  preferredStartVertexId?: string,
  maxStates: number = 100000,
  maxStepsRecorded: number = 800
): {
  result: HamiltonResult;
  steps: AlgorithmStep[];
} {
  const startTime = performance.now();
  const idToLabel = new Map(graph.vertices.map(v => [v.id, v.label]));
  const steps: AlgorithmStep[] = [];
  let stepIndex = 0;
  
  const n = graph.vertices.length;
  
  // Xử lý các trường hợp đặc biệt về số đỉnh
  if (n === 0) {
    return {
      result: {
        isHamiltonian: false,
        searchCompleted: true,
        reason: 'Đồ thị rỗng không có đỉnh nào.',
        totalStatesExplored: 0,
        executionTimeMs: 0,
      },
      steps: [],
    };
  }
  
  if (n === 1) {
    return {
      result: {
        isHamiltonian: false,
        searchCompleted: true,
        reason: 'Đồ thị chỉ có 1 đỉnh. Theo quy ước đồ thị đơn chuẩn, chu trình Hamilton tối thiểu phải đi qua ít nhất 3 đỉnh khác nhau (trừ khi có khuyên).',
        totalStatesExplored: 1,
        executionTimeMs: 0,
        specialCaseNote: 'Trường hợp đặc biệt: 1 đỉnh.',
      },
      steps: [],
    };
  }
  
  if (n === 2) {
    return {
      result: {
        isHamiltonian: false,
        searchCompleted: true,
        reason: 'Đồ thị có 2 đỉnh. Không thể tạo thành chu trình đơn vô hướng không lặp lại cạnh trong đồ thị đơn.',
        totalStatesExplored: 1,
        executionTimeMs: 0,
        specialCaseNote: 'Trường hợp đặc biệt: 2 đỉnh.',
      },
      steps: [],
    };
  }
  
  // Kiểm tra điều kiện cần: Mọi đỉnh phải có bậc >= 2
  const degrees = calculateDegrees(graph);
  const degreeLessThan2 = degrees.filter(d => d.degree < 2);
  if (degreeLessThan2.length > 0) {
    const labels = degreeLessThan2.map(d => `${d.label} (bậc ${d.degree})`).join(', ');
    return {
      result: {
        isHamiltonian: false,
        searchCompleted: true,
        reason: `Không tồn tại chu trình Hamilton vì có đỉnh bậc nhỏ hơn 2: ${labels}. Để tạo chu trình đi qua mỗi đỉnh, mỗi đỉnh cần ít nhất 1 cạnh đi vào và 1 cạnh đi ra (bậc ≥ 2).`,
        totalStatesExplored: 1,
        executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
      },
      steps: [{
        stepIndex: 1,
        algorithmType: 'hamilton',
        actionType: 'deadend',
        title: 'Kiểm tra điều kiện cần bậc đỉnh',
        description: `Phát hiện đỉnh có bậc < 2: ${labels}. Thuật toán kết luận ngay không tồn tại chu trình Hamilton mà không cần duyệt sâu.`,
        visitedVertexIds: [],
        traversedEdgeIds: [],
        currentPath: [],
      }],
    };
  }
  
  // Xây dựng danh sách kề
  const adj = new Map<string, string[]>();
  for (const v of graph.vertices) {
    adj.set(v.id, []);
  }
  for (const edge of graph.edges) {
    adj.get(edge.u)?.push(edge.v);
    adj.get(edge.v)?.push(edge.u);
  }
  
  // Đỉnh xuất phát
  let startId = preferredStartVertexId;
  if (!startId || !graph.vertices.some(v => v.id === startId)) {
    startId = graph.vertices[0].id;
  }
  
  const startLabel = idToLabel.get(startId)!;
  const path: string[] = [startId];
  const visited = new Set<string>([startId]);
  let statesExplored = 0;
  let cycleFound: string[] | null = null;
  let searchCompleted = true;
  
  steps.push({
    stepIndex: ++stepIndex,
    algorithmType: 'hamilton',
    actionType: 'start',
    title: `Bắt đầu tìm chu trình Hamilton từ đỉnh ${startLabel}`,
    description: `Khởi tạo ngăn xếp duyệt quay lui với đỉnh xuất phát là ${startLabel}. Mục tiêu: tìm đường đi đơn qua toàn bộ ${n} đỉnh rồi quay về ${startLabel}.`,
    activeVertexId: startId,
    visitedVertexIds: [startId],
    traversedEdgeIds: [],
    currentPath: [startLabel],
  });
  
  function backtrack(u: string): boolean {
    statesExplored++;
    
    if (statesExplored > maxStates) {
      searchCompleted = false;
      return true; // Dừng tìm kiếm do giới hạn an toàn
    }
    
    // Nếu đã đủ n đỉnh, kiểm tra cạnh nối từ đỉnh cuối về đỉnh xuất phát
    if (path.length === n) {
      const neighborsOfLast = adj.get(u) || [];
      const hasEdgeToStart = neighborsOfLast.includes(startId!);
      const startEdgeId = findEdgeId(graph.edges, u, startId!);
      
      if (hasEdgeToStart && startEdgeId) {
        cycleFound = [...path, startId!];
        
        if (stepIndex < maxStepsRecorded) {
          steps.push({
            stepIndex: ++stepIndex,
            algorithmType: 'hamilton',
            actionType: 'hamilton_success',
            title: `Tìm thấy chu trình Hamilton hoàn chỉnh!`,
            description: `Đã đi qua đủ ${n} đỉnh: ${path.map(id => idToLabel.get(id)).join(' → ')}. Tồn tại cạnh nối (${idToLabel.get(u)} - ${startLabel}) để khép kín chu trình!`,
            activeVertexId: u,
            targetVertexId: startId,
            activeEdgeId: startEdgeId,
            visitedVertexIds: Array.from(visited),
            traversedEdgeIds: getEdgeIdsForPath(graph.edges, cycleFound),
            currentPath: cycleFound.map(id => idToLabel.get(id)!),
            cycleHighlight: cycleFound.map(id => idToLabel.get(id)!),
          });
        }
        return true;
      } else {
        if (stepIndex < maxStepsRecorded) {
          steps.push({
            stepIndex: ++stepIndex,
            algorithmType: 'hamilton',
            actionType: 'deadend',
            title: `Đã đủ ${n} đỉnh nhưng KHÔNG thể khép chu trình`,
            description: `Đã thăm đủ ${n} đỉnh tại ${idToLabel.get(u)}, nhưng không có cạnh nối từ ${idToLabel.get(u)} về đỉnh xuất phát ${startLabel}. Nhánh này thất bại -> Quay lui.`,
            activeVertexId: u,
            targetVertexId: startId,
            visitedVertexIds: Array.from(visited),
            traversedEdgeIds: getEdgeIdsForPath(graph.edges, path),
            currentPath: path.map(id => idToLabel.get(id)!),
          });
        }
        return false;
      }
    }
    
    // Thử các đỉnh kề chưa thăm
    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        const edgeId = findEdgeId(graph.edges, u, v);
        visited.add(v);
        path.push(v);
        
        if (stepIndex < maxStepsRecorded) {
          steps.push({
            stepIndex: ++stepIndex,
            algorithmType: 'hamilton',
            actionType: 'hamilton_try',
            title: `Thử bước tới đỉnh ${idToLabel.get(v)}`,
            description: `Từ ${idToLabel.get(u)}, đỉnh kề ${idToLabel.get(v)} chưa được thăm. Thêm ${idToLabel.get(v)} vào đường đi hiện tại (độ dài ${path.length}/${n}).`,
            activeVertexId: v,
            targetVertexId: u,
            activeEdgeId: edgeId,
            visitedVertexIds: Array.from(visited),
            traversedEdgeIds: getEdgeIdsForPath(graph.edges, path),
            currentPath: path.map(id => idToLabel.get(id)!),
          });
        }
        
        const found = backtrack(v);
        if (found) return true;
        
        // Quay lui (Backtrack)
        path.pop();
        visited.delete(v);
        
        if (stepIndex < maxStepsRecorded) {
          steps.push({
            stepIndex: ++stepIndex,
            algorithmType: 'hamilton',
            actionType: 'hamilton_backtrack',
            title: `Quay lui từ đỉnh ${idToLabel.get(v)} về ${idToLabel.get(u)}`,
            description: `Nhánh duyệt qua ${idToLabel.get(v)} không thể tạo thành chu trình Hamilton. Rút ${idToLabel.get(v)} ra khỏi đường đi và tiếp tục thử các đỉnh kề khác của ${idToLabel.get(u)}.`,
            activeVertexId: u,
            targetVertexId: v,
            activeEdgeId: edgeId,
            visitedVertexIds: Array.from(visited),
            traversedEdgeIds: getEdgeIdsForPath(graph.edges, path),
            currentPath: path.map(id => idToLabel.get(id)!),
          });
        }
      }
    }
    
    return false;
  }
  
  const found = backtrack(startId);
  const elapsed = Number((performance.now() - startTime).toFixed(2));
  
  if (found && cycleFound) {
    const cycleLabels = (cycleFound as string[]).map(id => idToLabel.get(id)!);
    
    // Kiểm tra tính đúng đắn trước khi trả về
    const isValid = verifyHamiltonCycle(graph, cycleFound);
    if (!isValid) {
      console.warn('Cảnh báo: Chu trình Hamilton không vượt qua kiểm tra!');
    }
    
    return {
      result: {
        isHamiltonian: true,
        searchCompleted: true,
        reason: `Đã tìm thấy Chu trình Hamilton bằng thuật toán quay lui (duyệt qua ${statesExplored} trạng thái trong ${elapsed} ms). Mỗi đỉnh được ghé thăm đúng 1 lần và quay về đỉnh xuất phát ${startLabel}.`,
        cycle: cycleLabels,
        totalStatesExplored: statesExplored,
        executionTimeMs: elapsed,
        startVertex: startLabel,
      },
      steps,
    };
  }
  
  if (!searchCompleted) {
    return {
      result: {
        isHamiltonian: false,
        searchCompleted: false,
        reason: `Đã duyệt vượt quá giới hạn an toàn (${maxStates.toLocaleString()} trạng thái, ${elapsed} ms). Do bài toán chu trình Hamilton là bài toán NP-đầy đủ, không gian tìm kiếm bùng nổ cấp số nhân. Chưa thể khẳng định đồ thị có hay không có chu trình Hamilton từ đỉnh này!`,
        totalStatesExplored: statesExplored,
        executionTimeMs: elapsed,
        startVertex: startLabel,
        specialCaseNote: 'Thời gian tìm kiếm bị giới hạn an toàn để chống treo trình duyệt.',
      },
      steps,
    };
  }
  
  return {
    result: {
      isHamiltonian: false,
      searchCompleted: true,
      reason: `Đã duyệt toàn bộ không gian trạng thái (${statesExplored} nhánh tìm kiếm, ${elapsed} ms) xuất phát từ đỉnh ${startLabel} và không tìm thấy chu trình nào. Khẳng định đồ thị KHÔNG CÓ chu trình Hamilton.`,
      totalStatesExplored: statesExplored,
      executionTimeMs: elapsed,
      startVertex: startLabel,
    },
    steps,
  };
}

/**
 * Kiểm định chu trình Hamilton
 */
function verifyHamiltonCycle(graph: GraphData, cycleIds: string[]): boolean {
  const n = graph.vertices.length;
  if (cycleIds.length !== n + 1) return false;
  if (cycleIds[0] !== cycleIds[cycleIds.length - 1]) return false;
  
  const distinctNodes = new Set(cycleIds.slice(0, n));
  if (distinctNodes.size !== n) return false;
  
  for (let i = 0; i < cycleIds.length - 1; i++) {
    const u = cycleIds[i];
    const v = cycleIds[i + 1];
    if (!findEdgeId(graph.edges, u, v)) {
      return false;
    }
  }
  return true;
}

/**
 * Lấy danh sách ID các cạnh tương ứng với đường đi
 */
function getEdgeIdsForPath(edges: Edge[], pathVertexIds: string[]): string[] {
  const ids: string[] = [];
  for (let i = 0; i < pathVertexIds.length - 1; i++) {
    const eId = findEdgeId(edges, pathVertexIds[i], pathVertexIds[i + 1]);
    if (eId) ids.push(eId);
  }
  return ids;
}
