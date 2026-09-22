import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Vertex, 
  Edge, 
  GraphData, 
  EulerResult, 
  HamiltonResult, 
  AlgorithmStep,
  PresetGraph 
} from './types';
import { PRESET_GRAPHS } from './data/presets';
import { 
  calculateDegrees, 
  analyzeEuler, 
  analyzeHamilton, 
  findEdgeId 
} from './utils/graphAlgorithms';
import { GraphCanvas } from './components/GraphCanvas';
import { SimulationPlayer } from './components/SimulationPlayer';
import { ResultsPanel } from './components/ResultsPanel';
import { DegreeTable } from './components/DegreeTable';
import { GraphEditorControls } from './components/GraphEditorControls';
import { PythonSourceModal } from './components/PythonSourceModal';
import { TheoryGuideModal } from './components/TheoryGuideModal';
import { 
  Network, 
  Code2, 
  HelpCircle, 
  Target,
  FolderOpen
} from 'lucide-react';

export default function App() {
  const defaultPreset = PRESET_GRAPHS[0];

  const [vertices, setVertices] = useState<Vertex[]>(() => 
    defaultPreset.vertices.map(v => ({ ...v }))
  );
  const [edges, setEdges] = useState<Edge[]>(() =>
    defaultPreset.edges.map((e, idx) => ({ id: `e_${idx + 1}`, u: e.u, v: e.v }))
  );

  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);
  const [startVertexId, setStartVertexId] = useState<string | null>(() => defaultPreset.vertices[0]?.id || null);
  const [interactionMode, setInteractionMode] = useState<'select' | 'addEdge' | 'delete'>('select');

  // Trạng thái kết quả
  const [eulerResult, setEulerResult] = useState<EulerResult | null>(null);
  const [hamiltonResult, setHamiltonResult] = useState<HamiltonResult | null>(null);

  // Trạng thái mô phỏng
  const [activeSimulation, setActiveSimulation] = useState<'euler' | 'hamilton' | null>(null);
  const [simulationSteps, setSimulationSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // Modals
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);

  // Đối tượng đồ thị
  const currentGraph: GraphData = useMemo(() => ({
    vertices,
    edges,
  }), [vertices, edges]);

  // Bảng bậc đỉnh
  const degrees = useMemo(() => calculateDegrees(currentGraph), [currentGraph]);

  // Đảm bảo đỉnh bắt đầu luôn hợp lệ
  useEffect(() => {
    if (vertices.length > 0) {
      if (!startVertexId || !vertices.some(v => v.id === startVertexId)) {
        setStartVertexId(vertices[0].id);
      }
    } else {
      setStartVertexId(null);
    }
  }, [vertices, startVertexId]);

  // Căn tròn đều
  const handleAutoLayout = useCallback(() => {
    if (vertices.length === 0) return;
    const centerX = 330;
    const centerY = 260;
    const radius = Math.min(centerX - 60, centerY - 60, 190);
    const n = vertices.length;

    setVertices(prev =>
      prev.map((v, idx) => {
        const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
        return {
          ...v,
          x: Math.round(centerX + radius * Math.cos(angle)),
          y: Math.round(centerY + radius * Math.sin(angle)),
        };
      })
    );
  }, [vertices.length]);

  // Reset mô phỏng khi đồ thị thay đổi
  const invalidateSimulation = useCallback(() => {
    setActiveSimulation(null);
    setSimulationSteps([]);
    setCurrentStepIndex(0);
    setIsPlayingSimulation(false);
  }, []);

  const handleUpdateVertexPos = (id: string, x: number, y: number) => {
    setVertices(prev => prev.map(v => (v.id === id ? { ...v, x, y } : v)));
  };

  const handleAddVertex = (customLabel?: string) => {
    let label = customLabel;
    if (!label) {
      const existingLabels = new Set(vertices.map(v => v.label));
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < alphabet.length; i++) {
        if (!existingLabels.has(alphabet[i])) {
          label = alphabet[i];
          break;
        }
      }
      if (!label) {
        label = `V${vertices.length + 1}`;
      }
    }

    const newVertex: Vertex = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label,
      x: 180 + Math.floor(Math.random() * 260),
      y: 160 + Math.floor(Math.random() * 200),
    };

    setVertices(prev => [...prev, newVertex]);
    invalidateSimulation();
  };

  const handleAddEdge = (uId: string, vId: string) => {
    if (uId === vId) return;
    const existing = findEdgeId(edges, uId, vId);
    if (existing) return;

    const newEdge: Edge = {
      id: `e_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      u: uId,
      v: vId,
    };
    setEdges(prev => [...prev, newEdge]);
    invalidateSimulation();
  };

  const handleDeleteVertex = (id: string) => {
    setVertices(prev => prev.filter(v => v.id !== id));
    setEdges(prev => prev.filter(e => e.u !== id && e.v !== id));
    if (selectedVertexId === id) setSelectedVertexId(null);
    if (startVertexId === id) setStartVertexId(null);
    invalidateSimulation();
  };

  const handleDeleteEdge = (id: string) => {
    setEdges(prev => prev.filter(e => e.id !== id));
    invalidateSimulation();
  };

  const handleRenameVertex = (id: string, newLabel: string) => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    setVertices(prev => prev.map(v => (v.id === id ? { ...v, label: trimmed } : v)));
    invalidateSimulation();
  };

  const handleClearGraph = () => {
    setVertices([]);
    setEdges([]);
    setSelectedVertexId(null);
    setStartVertexId(null);
    setEulerResult(null);
    setHamiltonResult(null);
    invalidateSimulation();
  };

  const handleImportEdgeList = (rawInput: string): { added: number; errors: string[] } => {
    const tokens = rawInput
      .replace(/;/g, ',')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const vertexMap = new Map<string, string>();
    vertices.forEach(v => vertexMap.set(v.label, v.id));

    const newVerticesList: Vertex[] = [...vertices];
    const newEdgesList: Edge[] = [];
    const existingEdgePairs = new Set(
      edges.map(e => `${[e.u, e.v].sort().join('-')}`)
    );

    let addedCount = 0;
    const errors: string[] = [];

    const getOrCreateVertex = (label: string): string => {
      let id = vertexMap.get(label);
      if (!id) {
        id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        vertexMap.set(label, id);
        newVerticesList.push({
          id,
          label,
          x: 200 + Math.floor(Math.random() * 260),
          y: 160 + Math.floor(Math.random() * 200),
        });
      }
      return id;
    };

    for (const token of tokens) {
      let uLabel = '';
      let vLabel = '';

      if (token.includes('-')) {
        const parts = token.split('-').map(p => p.trim()).filter(Boolean);
        if (parts.length === 2) {
          uLabel = parts[0];
          vLabel = parts[1];
        } else {
          errors.push(`'${token}' sai định dạng`);
          continue;
        }
      } else if (token.length === 2) {
        uLabel = token[0];
        vLabel = token[1];
      } else {
        errors.push(`'${token}' không hợp lệ`);
        continue;
      }

      if (uLabel === vLabel) {
        errors.push(`Bỏ qua khuyên (${uLabel})`);
        continue;
      }

      const uId = getOrCreateVertex(uLabel);
      const vId = getOrCreateVertex(vLabel);
      const pairKey = [uId, vId].sort().join('-');

      if (existingEdgePairs.has(pairKey)) {
        errors.push(`Cạnh trùng (${uLabel}-${vLabel})`);
        continue;
      }

      existingEdgePairs.add(pairKey);
      newEdgesList.push({
        id: `e_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        u: uId,
        v: vId,
      });
      addedCount++;
    }

    setVertices(newVerticesList);
    setEdges(prev => [...prev, ...newEdgesList]);
    invalidateSimulation();

    setTimeout(() => {
      handleAutoLayout();
    }, 50);

    return { added: addedCount, errors };
  };

  const handleGenerateRandomGraph = (nodeCount: number, edgeProbability: number) => {
    const alphabet = 'ABCDEFGH';
    const newVerts: Vertex[] = [];
    const centerX = 330;
    const centerY = 260;
    const radius = Math.min(centerX - 60, centerY - 60, 190);

    for (let i = 0; i < nodeCount; i++) {
      const label = alphabet[i] || `V${i + 1}`;
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      newVerts.push({
        id: `v_${i + 1}`,
        label,
        x: Math.round(centerX + radius * Math.cos(angle)),
        y: Math.round(centerY + radius * Math.sin(angle)),
      });
    }

    const newEdges: Edge[] = [];
    let edgeIdCounter = 1;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < edgeProbability) {
          newEdges.push({
            id: `e_${edgeIdCounter++}`,
            u: newVerts[i].id,
            v: newVerts[j].id,
          });
        }
      }
    }

    setVertices(newVerts);
    setEdges(newEdges);
    setStartVertexId(newVerts[0]?.id || null);
    invalidateSimulation();
  };

  const handleLoadPresetById = (presetId: string) => {
    const preset = PRESET_GRAPHS.find(p => p.id === presetId);
    if (!preset) return;
    setVertices(preset.vertices.map(v => ({ ...v })));
    setEdges(preset.edges.map((e, idx) => ({ id: `e_${idx + 1}`, u: e.u, v: e.v })));
    setStartVertexId(preset.vertices[0]?.id || null);
    setSelectedVertexId(null);
    invalidateSimulation();
  };

  const handleCheckEuler = () => {
    const { result, steps } = analyzeEuler(currentGraph, startVertexId || undefined);
    setEulerResult(result);
    return { result, steps };
  };

  const handleCheckHamilton = () => {
    const { result, steps } = analyzeHamilton(currentGraph, startVertexId || undefined);
    setHamiltonResult(result);
    return { result, steps };
  };

  const handleCheckBoth = () => {
    handleCheckEuler();
    handleCheckHamilton();
  };

  const handleSimulateEuler = () => {
    const { steps } = analyzeEuler(currentGraph, startVertexId || undefined);
    if (steps.length === 0) return;
    setActiveSimulation('euler');
    setSimulationSteps(steps);
    setCurrentStepIndex(0);
    setIsPlayingSimulation(true);
  };

  const handleSimulateHamilton = () => {
    const { steps } = analyzeHamilton(currentGraph, startVertexId || undefined);
    if (steps.length === 0) return;
    setActiveSimulation('hamilton');
    setSimulationSteps(steps);
    setCurrentStepIndex(0);
    setIsPlayingSimulation(true);
  };

  const activeStep = activeSimulation ? simulationSteps[currentStepIndex] : null;

  const highlightedCycle = useMemo(() => {
    // Khi đang trong chế độ mô phỏng từng bước:
    if (activeSimulation) {
      // Chỉ highlight toàn bộ chu trình ở bước cuối cùng khi tìm thấy thành công
      return activeStep?.cycleHighlight || null;
    }
    // Khi ở chế độ tĩnh bình thường:
    if (eulerResult?.cycle) return eulerResult.cycle;
    if (hamiltonResult?.cycle) return hamiltonResult.cycle;
    return null;
  }, [activeStep, activeSimulation, eulerResult, hamiltonResult]);

  // Tự động kiểm tra ngay khi mở app
  useEffect(() => {
    handleCheckBoth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header tinh gọn, đầy đủ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo & Tiêu đề */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
                Đồ Thị Euler & Hamilton
              </h1>
              <span className="text-[11px] text-slate-500 font-medium">
                Toán Rời Rạc • Hierholzer & Quay lui
              </span>
            </div>
          </div>

          {/* Bộ chọn bài mẫu & Đỉnh xuất phát ngay trên thanh tiêu đề */}
          <div className="flex items-center gap-2">
            {/* Dropdown Đồ thị mẫu */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <select
                onChange={(e) => handleLoadPresetById(e.target.value)}
                defaultValue={defaultPreset.id}
                className="bg-transparent font-medium text-slate-800 outline-none text-xs cursor-pointer max-w-[170px] sm:max-w-[220px] truncate"
              >
                {PRESET_GRAPHS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Đỉnh xuất phát */}
            {vertices.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
                <Target className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-500 text-[11px]">Bắt đầu:</span>
                <select
                  value={startVertexId || ''}
                  onChange={(e) => setStartVertexId(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer"
                >
                  {vertices.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Nút Hướng dẫn */}
            <button
              onClick={() => setIsTheoryModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-colors border border-slate-200"
              title="Xem lý thuyết và quy ước"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Lý thuyết</span>
            </button>

            {/* Nút Mã Python */}
            <button
              onClick={() => setIsPythonModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-colors shadow-xs"
              title="Tải mã nguồn Python"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Mã Python</span>
            </button>
          </div>
        </div>
      </header>

      {/* Nội dung chính chia 2 cột */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* CỘT TRÁI: BẢNG VẼ ĐỒ THỊ & TRÌNH MÔ PHỎNG (Ở DƯỚI HÌNH) */}
          <div className="lg:col-span-7 space-y-3">
            <GraphCanvas
              vertices={vertices}
              edges={edges}
              selectedVertexId={selectedVertexId}
              onSelectVertex={setSelectedVertexId}
              onAddVertex={() => handleAddVertex()}
              onAddEdge={handleAddEdge}
              onDeleteVertex={handleDeleteVertex}
              onDeleteEdge={handleDeleteEdge}
              onClearGraph={handleClearGraph}
              onUpdateVertexPos={handleUpdateVertexPos}
              onAutoLayout={handleAutoLayout}
              startVertexId={startVertexId}
              onSetStartVertex={setStartVertexId}
              activeStep={activeStep}
              highlightedCycle={highlightedCycle}
              interactionMode={interactionMode}
              setInteractionMode={setInteractionMode}
            />

            {/* Trình mô phỏng đặt ngay dưới hình đồ thị */}
            {activeSimulation && (
              <SimulationPlayer
                steps={simulationSteps}
                currentStepIndex={currentStepIndex}
                onSetStepIndex={setCurrentStepIndex}
                isPlaying={isPlayingSimulation}
                onTogglePlay={() => setIsPlayingSimulation(!isPlayingSimulation)}
                speed={simulationSpeed}
                onChangeSpeed={setSimulationSpeed}
                algorithmName={activeSimulation === 'euler' ? 'Euler (Hierholzer)' : 'Hamilton (Quay lui)'}
                onCloseSimulation={() => setActiveSimulation(null)}
              />
            )}
          </div>

          {/* CỘT PHẢI: KẾT QUẢ, BẢNG BẬC & CÔNG CỤ NHẬP LIỆU */}
          <div className="lg:col-span-5 space-y-3">
            {/* 1. Kết quả kiểm tra */}
            <ResultsPanel
              eulerResult={eulerResult}
              hamiltonResult={hamiltonResult}
              onSimulateEuler={handleSimulateEuler}
              onSimulateHamilton={handleSimulateHamilton}
              onCheckEuler={handleCheckEuler}
              onCheckHamilton={handleCheckHamilton}
              onCheckBoth={handleCheckBoth}
            />

            {/* 2. Bảng bậc các đỉnh */}
            <DegreeTable
              degrees={degrees}
              totalEdges={edges.length}
            />

            {/* 3. Nhập danh sách cạnh hoặc tạo ngẫu nhiên */}
            <GraphEditorControls
              vertices={vertices}
              edges={edges}
              onAddVertex={handleAddVertex}
              onAddEdge={handleAddEdge}
              onDeleteVertex={handleDeleteVertex}
              onRenameVertex={handleRenameVertex}
              onImportEdgeList={handleImportEdgeList}
              onGenerateRandomGraph={handleGenerateRandomGraph}
              selectedVertexId={selectedVertexId}
            />
          </div>
        </div>
      </main>

      {/* Modal Mã nguồn Python */}
      <PythonSourceModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
      />

      {/* Modal Lý thuyết Toán rời rạc */}
      <TheoryGuideModal
        isOpen={isTheoryModalOpen}
        onClose={() => setIsTheoryModalOpen(false)}
      />
    </div>
  );
}
