import { useState, useRef, MouseEvent } from 'react';
import { Vertex, Edge, AlgorithmStep } from '../types';
import { findEdgeId } from '../utils/graphAlgorithms';
import { 
  Move, 
  Link2, 
  Trash2, 
  Plus, 
  Sparkles, 
  RotateCcw,
  Target
} from 'lucide-react';

interface GraphCanvasProps {
  vertices: Vertex[];
  edges: Edge[];
  selectedVertexId: string | null;
  onSelectVertex: (id: string | null) => void;
  onAddVertex: () => void;
  onAddEdge: (u: string, v: string) => void;
  onDeleteVertex: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onClearGraph: () => void;
  onUpdateVertexPos: (id: string, x: number, y: number) => void;
  onAutoLayout: () => void;
  startVertexId: string | null;
  onSetStartVertex: (id: string) => void;
  activeStep?: AlgorithmStep | null;
  highlightedCycle?: string[] | null;
  interactionMode: 'select' | 'addEdge' | 'delete';
  setInteractionMode: (mode: 'select' | 'addEdge' | 'delete') => void;
}

export function GraphCanvas({
  vertices,
  edges,
  selectedVertexId,
  onSelectVertex,
  onAddVertex,
  onAddEdge,
  onDeleteVertex,
  onDeleteEdge,
  onClearGraph,
  onUpdateVertexPos,
  onAutoLayout,
  startVertexId,
  onSetStartVertex,
  activeStep,
  highlightedCycle,
  interactionMode,
  setInteractionMode,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingVertexId, setDraggingVertexId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [edgeStartVertexId, setEdgeStartVertexId] = useState<string | null>(null);

  const labelToId = new Map(vertices.map(v => [v.label, v.id]));
  const idToLabel = new Map(vertices.map(v => [v.id, v.label]));

  // Tập hợp các ID cạnh thuộc chu trình được tô màu
  const cycleEdgeIds = new Set<string>();
  if (highlightedCycle && highlightedCycle.length > 1) {
    for (let i = 0; i < highlightedCycle.length - 1; i++) {
      const uLabel = highlightedCycle[i];
      const vLabel = highlightedCycle[i + 1];
      const uId = labelToId.get(uLabel);
      const vId = labelToId.get(vLabel);
      if (uId && vId) {
        const eId = findEdgeId(edges, uId, vId);
        if (eId) cycleEdgeIds.add(eId);
      }
    }
  }

  // Xử lý kéo thả đỉnh hoặc tương tác
  const handleMouseDownNode = (e: MouseEvent, v: Vertex) => {
    e.stopPropagation();

    if (interactionMode === 'delete') {
      onDeleteVertex(v.id);
      return;
    }

    if (interactionMode === 'addEdge') {
      if (!edgeStartVertexId) {
        setEdgeStartVertexId(v.id);
        onSelectVertex(v.id);
      } else if (edgeStartVertexId !== v.id) {
        onAddEdge(edgeStartVertexId, v.id);
        setEdgeStartVertexId(null);
        onSelectVertex(null);
      } else {
        setEdgeStartVertexId(null);
        onSelectVertex(null);
      }
      return;
    }

    // Chế độ select / di chuyển
    onSelectVertex(v.id);
    setDraggingVertexId(v.id);
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - v.x,
        y: e.clientY - rect.top - v.y,
      });
    }
  };

  const handleMouseMoveSvg = (e: MouseEvent) => {
    if (!draggingVertexId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(26, Math.min(rect.width - 26, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(26, Math.min(rect.height - 26, e.clientY - rect.top - dragOffset.y));
    onUpdateVertexPos(draggingVertexId, Math.round(newX), Math.round(newY));
  };

  const handleMouseUpSvg = () => {
    setDraggingVertexId(null);
  };

  const handleSvgClick = (e: MouseEvent) => {
    if (e.target === svgRef.current) {
      onSelectVertex(null);
      setEdgeStartVertexId(null);
    }
  };

  return (
    <div className="relative w-full h-[540px] bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col overflow-hidden select-none">
      {/* Thanh công cụ gọn gàng phía trên Canvas */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs">
        {/* Nhóm chế độ chuột */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => { setInteractionMode('select'); setEdgeStartVertexId(null); }}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
              interactionMode === 'select'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Kéo thả di chuyển hoặc chọn đỉnh"
          >
            <Move className="w-3.5 h-3.5" />
            <span>Kéo chọn</span>
          </button>

          <button
            onClick={() => { setInteractionMode('addEdge'); setEdgeStartVertexId(null); }}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
              interactionMode === 'addEdge'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Bấm lần lượt 2 đỉnh để nối cạnh"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Nối cạnh</span>
          </button>

          <button
            onClick={() => { setInteractionMode('delete'); setEdgeStartVertexId(null); }}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
              interactionMode === 'delete'
                ? 'bg-rose-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Nhấp vào đỉnh hoặc cạnh để xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa</span>
          </button>
        </div>

        {/* Trạng thái gợi ý ngắn gọn khi đang thao tác */}
        <div className="hidden sm:block text-slate-400 font-mono text-[11px] truncate">
          {interactionMode === 'addEdge' && (
            <span className="text-emerald-400">
              {edgeStartVertexId ? `Đã chọn ${idToLabel.get(edgeStartVertexId)} → Nhấn đỉnh thứ 2` : 'Nhấn đỉnh đầu tiên để nối'}
            </span>
          )}
          {interactionMode === 'delete' && (
            <span className="text-rose-400">Nhấp đỉnh hoặc cạnh bất kỳ để xóa</span>
          )}
          {interactionMode === 'select' && (
            <span>Kéo đỉnh để chỉnh vị trí • Nhấp để chọn</span>
          )}
        </div>

        {/* Các nút thao tác nhanh trên đồ thị */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onAddVertex}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium flex items-center gap-1 transition-colors border border-slate-700"
            title="Thêm đỉnh mới"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thêm đỉnh</span>
          </button>

          <button
            onClick={onAutoLayout}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium flex items-center gap-1 transition-colors border border-slate-700"
            title="Tự động sắp xếp các đỉnh theo vòng tròn đều"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Xếp tròn</span>
          </button>

          <button
            onClick={onClearGraph}
            className="px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
            title="Xóa toàn bộ đồ thị"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vùng vẽ SVG */}
      <svg
        ref={svgRef}
        className="w-full flex-1 cursor-default"
        onMouseMove={handleMouseMoveSvg}
        onMouseUp={handleMouseUpSvg}
        onClick={handleSvgClick}
      >
        <defs>
          <pattern id="canvas-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="0.8" fill="#334155" opacity="0.4" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#canvas-grid)" />

        {/* Vẽ CẠNH */}
        {edges.map(edge => {
          const uNode = vertices.find(v => v.id === edge.u);
          const vNode = vertices.find(v => v.id === edge.v);
          if (!uNode || !vNode) return null;

          const isSimulating = activeStep != null;
          const isActiveEdge = activeStep?.activeEdgeId === edge.id;
          const isTraversed = activeStep?.traversedEdgeIds?.includes(edge.id);
          const isBacktracked = activeStep?.backtrackedEdgeIds?.includes(edge.id);
          const isInCycle = cycleEdgeIds.has(edge.id);

          let strokeColor = '#334155';
          let strokeWidth = 1.8;
          let strokeDash: string | undefined = undefined;

          if (isSimulating) {
            // Khi đang mô phỏng:
            if (isActiveEdge) {
              // Đang xét: màu vàng hổ phách nổi bật
              strokeColor = '#f59e0b';
              strokeWidth = 4.5;
            } else if (isTraversed || isInCycle) {
              // Sau khi xét xong: màu xanh lá
              strokeColor = '#10b981';
              strokeWidth = 3.5;
            } else if (isBacktracked) {
              // Ngõ cụt / quay lui
              strokeColor = '#ef4444';
              strokeWidth = 2.2;
              strokeDash = '4 3';
            } else {
              // Chưa xét: Chưa có màu (xám tối trung tính)
              strokeColor = '#334155';
              strokeWidth = 1.8;
            }
          } else {
            // Khi không mô phỏng (xem kết quả tĩnh hoặc chỉnh sửa):
            if (isInCycle) {
              strokeColor = '#10b981';
              strokeWidth = 3.5;
            } else {
              strokeColor = '#475569';
              strokeWidth = 2.2;
            }
          }

          return (
            <g key={edge.id}>
              {/* Vùng bấm cạnh */}
              <line
                x1={uNode.x}
                y1={uNode.y}
                x2={vNode.x}
                y2={vNode.y}
                stroke="transparent"
                strokeWidth={14}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (interactionMode === 'delete') {
                    onDeleteEdge(edge.id);
                  }
                }}
              />
              <line
                x1={uNode.x}
                y1={uNode.y}
                x2={vNode.x}
                y2={vNode.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Vẽ ĐỈNH */}
        {vertices.map(v => {
          const isSelected = selectedVertexId === v.id;
          const isEdgeStart = edgeStartVertexId === v.id;
          const isStartNode = startVertexId === v.id;
          const isSimulating = activeStep != null;
          const isActiveStepNode = activeStep?.activeVertexId === v.id;
          const isVisitedInStep = activeStep?.visitedVertexIds?.includes(v.id);
          const isInCycle = highlightedCycle?.includes(v.label);

          let fillColor = '#0f172a';
          let strokeColor = '#475569';
          let nodeRadius = 20;
          let strokeWidth = 1.8;

          if (isSimulating) {
            // Khi đang mô phỏng:
            if (isActiveStepNode) {
              // Đang xét: Màu khác nổi bật (Vàng hổ phách)
              fillColor = '#b45309';
              strokeColor = '#fbbf24';
              strokeWidth = 3;
              nodeRadius = 23;
            } else if (isVisitedInStep || isInCycle) {
              // Sau khi xét xong: Màu xanh lá
              fillColor = '#065f46';
              strokeColor = '#34d399';
              strokeWidth = 2.5;
              nodeRadius = 20;
            } else {
              // Chưa xét: Chưa có màu (Màu xám tối trung tính)
              fillColor = '#0f172a';
              strokeColor = '#475569';
              strokeWidth = 1.8;
              nodeRadius = 20;
            }
          } else {
            // Khi không mô phỏng:
            if (isInCycle) {
              fillColor = '#065f46';
              strokeColor = '#34d399';
              strokeWidth = 2.5;
            } else if (isEdgeStart || isSelected) {
              fillColor = '#312e81';
              strokeColor = '#a5b4fc';
              strokeWidth = 2.5;
              nodeRadius = 22;
            } else {
              fillColor = '#1e293b';
              strokeColor = '#6366f1';
              strokeWidth = 1.8;
            }
          }

          return (
            <g
              key={v.id}
              transform={`translate(${v.x}, ${v.y})`}
              className="cursor-pointer select-none"
              onMouseDown={(e) => handleMouseDownNode(e, v)}
            >
              {/* Đỉnh xuất phát */}
              {isStartNode && (
                <circle
                  r={nodeRadius + 5}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={1.8}
                  strokeDasharray="4 2"
                />
              )}

              {/* Thân đỉnh */}
              <circle
                r={nodeRadius}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isSelected || isEdgeStart || isActiveStepNode ? 2.5 : 1.8}
              />

              {/* Nhãn đỉnh */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="#ffffff"
                fontSize={14}
                fontWeight="700"
                fontFamily="sans-serif"
                className="pointer-events-none"
              >
                {v.label}
              </text>

              {/* Dấu sao nhỏ cho đỉnh xuất phát */}
              {isStartNode && (
                <g transform="translate(13, -13)">
                  <circle r={5} fill="#f59e0b" />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#0f172a"
                    fontSize={7}
                    fontWeight="800"
                  >
                    ★
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Thanh chú giải tinh gọn ở chân Canvas */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-500">Chú giải:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-500 bg-slate-800"></span>
            <span>Chưa xét (chưa có màu)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/40"></span>
            <span className="text-amber-300 font-medium">Đang xét</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-400/40"></span>
            <span className="text-emerald-300 font-medium">Đã xét xong (Xanh lá)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400 font-bold">★</span>
            <span>Đỉnh bắt đầu</span>
          </span>
        </div>

        {startVertexId && (
          <div className="flex items-center gap-1 text-slate-300">
            <Target className="w-3 h-3 text-amber-400" />
            <span>Đỉnh bắt đầu: <strong className="text-amber-300">{idToLabel.get(startVertexId)}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
