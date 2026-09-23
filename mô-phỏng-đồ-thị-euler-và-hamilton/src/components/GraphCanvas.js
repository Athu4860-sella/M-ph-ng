import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import { GraphData, Vertex, Edge, SimulationStep, CanvasTool, DegreeInfo } from '../types/graph';
import { edgeExists, generateVertexLabel, applyCircularLayout } from '../utils/graphModel';
import { Move, CircleDot, Share2, Trash2, RotateCcw, Sparkles, Info } from 'lucide-react';
export const GraphCanvas = ({ graph, degrees, currentStep, activeAlgorithm, onUpdateGraph, onResetSimulation, }) => {
    const svgRef = useRef(null);
    const [currentTool, setCurrentTool] = useState('select');
    // Trạng thái kéo thả đỉnh
    const [draggingVertexId, setDraggingVertexId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    // Trạng thái chọn đỉnh để tạo cạnh
    const [edgeSourceVertexId, setEdgeSourceVertexId] = useState(null);
    // Thông báo nhanh
    const [toastMessage, setToastMessage] = useState(null);
    const toastTimeoutRef = useRef(null);
    const showToast = (msg) => {
        if (toastTimeoutRef.current)
            clearTimeout(toastTimeoutRef.current);
        setToastMessage(msg);
        toastTimeoutRef.current = window.setTimeout(() => {
            setToastMessage(null);
        }, 2800);
    };
    // Bản đồ bậc đỉnh theo ID
    const degreeMap = new Map(degrees.map(d => [d.vertexId, d]));
    // Lấy tọa độ SVG từ con trỏ chuột/chạm
    const getSVGCoordinates = (e) => {
        if (!svgRef.current)
            return { x: 0, y: 0 };
        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = 600 / rect.width;
        const scaleY = 500 / rect.height;
        return {
            x: Math.round((e.clientX - rect.left) * scaleX),
            y: Math.round((e.clientY - rect.top) * scaleY),
        };
    };
    // Xử lý thêm đỉnh khi nhấp vào vùng trống của canvas
    const handleCanvasClick = (e) => {
        if (currentTool !== 'add_vertex')
            return;
        if (e.target.tagName !== 'svg' && e.target.id !== 'canvas-background') {
            return;
        }
        const { x, y } = getSVGCoordinates(e);
        const clampedX = Math.max(35, Math.min(565, x));
        const clampedY = Math.max(35, Math.min(465, y));
        const newLabel = generateVertexLabel(graph.vertices.length);
        const newVertex = {
            id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            label: newLabel,
            x: clampedX,
            y: clampedY,
        };
        onUpdateGraph({
            vertices: [...graph.vertices, newVertex],
            edges: graph.edges,
        });
        onResetSimulation();
    };
    // Thao tác trên đỉnh
    const handleVertexPointerDown = (e, vertex) => {
        e.stopPropagation();
        if (currentTool === 'delete') {
            const updatedVertices = graph.vertices.filter(v => v.id !== vertex.id);
            const updatedEdges = graph.edges.filter(edge => edge.source !== vertex.id && edge.target !== vertex.id);
            onUpdateGraph({
                vertices: updatedVertices,
                edges: updatedEdges,
            });
            onResetSimulation();
            showToast(`Đã xóa đỉnh ${vertex.label}`);
            return;
        }
        if (currentTool === 'add_edge') {
            if (!edgeSourceVertexId) {
                setEdgeSourceVertexId(vertex.id);
            }
            else {
                if (edgeSourceVertexId === vertex.id) {
                    showToast('Đồ thị đơn không có khuyên (cạnh nối đỉnh với chính nó).');
                    setEdgeSourceVertexId(null);
                    return;
                }
                if (edgeExists(graph.edges, edgeSourceVertexId, vertex.id)) {
                    showToast('Cạnh này đã tồn tại.');
                    setEdgeSourceVertexId(null);
                    return;
                }
                const newEdge = {
                    id: `e_${Date.now()}_${graph.edges.length}`,
                    source: edgeSourceVertexId,
                    target: vertex.id,
                };
                onUpdateGraph({
                    vertices: graph.vertices,
                    edges: [...graph.edges, newEdge],
                });
                onResetSimulation();
                setEdgeSourceVertexId(null);
                const sourceV = graph.vertices.find(v => v.id === edgeSourceVertexId);
                showToast(`Đã thêm cạnh (${sourceV?.label} – ${vertex.label})`);
            }
            return;
        }
        if (currentTool === 'select') {
            setDraggingVertexId(vertex.id);
            const coords = getSVGCoordinates(e);
            setDragOffset({
                x: coords.x - vertex.x,
                y: coords.y - vertex.y,
            });
        }
    };
    // Kéo di chuyển đỉnh
    const handlePointerMove = (e) => {
        if (!draggingVertexId)
            return;
        const coords = getSVGCoordinates(e);
        const newX = Math.max(35, Math.min(565, coords.x - dragOffset.x));
        const newY = Math.max(35, Math.min(465, coords.y - dragOffset.y));
        onUpdateGraph({
            vertices: graph.vertices.map(v => v.id === draggingVertexId ? { ...v, x: newX, y: newY } : v),
            edges: graph.edges,
        });
    };
    const handlePointerUp = () => {
        if (draggingVertexId) {
            setDraggingVertexId(null);
        }
    };
    // Xóa cạnh
    const handleEdgeClick = (e, edge) => {
        e.stopPropagation();
        if (currentTool === 'delete') {
            const updatedEdges = graph.edges.filter(edgeItem => edgeItem.id !== edge.id);
            onUpdateGraph({
                vertices: graph.vertices,
                edges: updatedEdges,
            });
            onResetSimulation();
            showToast('Đã xóa cạnh.');
        }
    };
    // Tự sắp xếp tròn
    const handleAutoCircularLayout = () => {
        const updated = applyCircularLayout(graph.vertices, 600, 500, 75);
        onUpdateGraph({
            vertices: updated,
            edges: graph.edges,
        });
    };
    // Xóa toàn bộ đồ thị
    const handleClearGraph = () => {
        if (graph.vertices.length === 0)
            return;
        onUpdateGraph({ vertices: [], edges: [] });
        onResetSimulation();
        setEdgeSourceVertexId(null);
        showToast('Đã làm mới vùng vẽ.');
    };
    const visitedEdgeSet = new Set(currentStep?.visitedEdgeIds || []);
    const visitedVertexSet = new Set(currentStep?.visitedVertexIds || []);
    const traversedEdgeOrders = new Map();
    if (currentStep?.traversedEdges) {
        for (const t of currentStep.traversedEdges) {
            traversedEdgeOrders.set(t.edgeId, t.order);
        }
    }
    const vertexPosMap = new Map(graph.vertices.map(v => [v.id, { x: v.x, y: v.y, label: v.label }]));
    return (_jsxs("div", { className: "flex flex-col h-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs select-none", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-50/90 border-b border-slate-200/80", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs("button", { onClick: () => {
                                    setCurrentTool('select');
                                    setEdgeSourceVertexId(null);
                                }, className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${currentTool === 'select'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`, title: "Di chuy\u1EC3n v\u00E0 k\u00E9o th\u1EA3 \u0111\u1EC9nh", children: [_jsx(Move, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "K\u00E9o th\u1EA3" })] }), _jsxs("button", { onClick: () => {
                                    setCurrentTool('add_vertex');
                                    setEdgeSourceVertexId(null);
                                }, className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${currentTool === 'add_vertex'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`, title: "Nh\u1EA5p v\u00E0o v\u00F9ng tr\u1ED1ng \u0111\u1EC3 th\u00EAm \u0111\u1EC9nh m\u1EDBi", children: [_jsx(CircleDot, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Th\u00EAm \u0111\u1EC9nh" })] }), _jsxs("button", { onClick: () => {
                                    setCurrentTool('add_edge');
                                    setEdgeSourceVertexId(null);
                                }, className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${currentTool === 'add_edge'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'}`, title: "Nh\u1EA5p ch\u1ECDn 2 \u0111\u1EC9nh \u0111\u1EC3 t\u1EA1o c\u1EA1nh n\u1ED1i", children: [_jsx(Share2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Th\u00EAm c\u1EA1nh" })] }), _jsxs("button", { onClick: () => {
                                    setCurrentTool('delete');
                                    setEdgeSourceVertexId(null);
                                }, className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${currentTool === 'delete'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'}`, title: "Nh\u1EA5p v\u00E0o \u0111\u1EC9nh ho\u1EB7c c\u1EA1nh \u0111\u1EC3 x\u00F3a", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "X\u00F3a" })] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs("button", { onClick: handleAutoCircularLayout, className: "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer", title: "T\u1EF1 \u0111\u1ED9ng x\u1EBFp tr\u00F2n \u0111\u1EC1u c\u00E1c \u0111\u1EC9nh", children: [_jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }), _jsx("span", { className: "hidden sm:inline", children: "B\u1ED1 c\u1EE5c tr\u00F2n" })] }), _jsxs("button", { onClick: handleClearGraph, className: "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer", title: "L\u00E0m m\u1EDBi v\u00F9ng v\u1EBD", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), _jsx("span", { className: "hidden sm:inline", children: "L\u00E0m m\u1EDBi" })] })] })] }), _jsxs("div", { className: "flex items-center justify-between px-3.5 py-1.5 bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500", children: [_jsxs("div", { className: "flex items-center gap-1.5 truncate", children: [_jsx(Info, { className: "w-3.5 h-3.5 text-indigo-500 shrink-0" }), _jsxs("span", { className: "font-medium", children: [currentTool === 'select' && 'Kéo đỉnh để đổi vị trí trực tiếp trên đồ thị.', currentTool === 'add_vertex' && 'Nhấp vào vùng trống bất kỳ để tạo đỉnh mới.', currentTool === 'add_edge' && (edgeSourceVertexId
                                        ? `Đang chọn đỉnh ${vertexPosMap.get(edgeSourceVertexId)?.label}. Hãy nhấp đỉnh thứ hai để tạo cạnh.`
                                        : 'Nhấp đỉnh 1, sau đó nhấp đỉnh 2 để tạo cạnh.'), currentTool === 'delete' && 'Nhấp vào đỉnh hoặc cạnh cần xóa.'] })] }), _jsxs("div", { className: "text-slate-500 text-xs font-medium shrink-0 ml-2", children: ["|V| = ", graph.vertices.length, ", |E| = ", graph.edges.length] })] }), _jsxs("div", { className: "relative flex-1 w-full min-h-[380px] bg-slate-50/60 overflow-hidden cursor-crosshair", children: [_jsx("div", { className: "absolute inset-0 pointer-events-none opacity-40", style: {
                            backgroundImage: 'radial-gradient(#94a3b8 1.1px, transparent 1.1px)',
                            backgroundSize: '22px 22px',
                        } }), toastMessage && (_jsx("div", { className: "absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-full shadow-lg pointer-events-none transition-all", children: toastMessage })), _jsxs("svg", { ref: svgRef, viewBox: "0 0 600 500", className: "w-full h-full", onPointerDown: handleCanvasClick, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, onPointerLeave: handlePointerUp, children: [_jsx("rect", { id: "canvas-background", width: "600", height: "500", fill: "transparent" }), _jsx("g", { className: "edges-group", children: graph.edges.map(edge => {
                                    const u = vertexPosMap.get(edge.source);
                                    const v = vertexPosMap.get(edge.target);
                                    if (!u || !v)
                                        return null;
                                    const isTraversed = visitedEdgeSet.has(edge.id);
                                    const isActiveEdge = currentStep?.activeEdgeId === edge.id;
                                    const traversalOrder = traversedEdgeOrders.get(edge.id);
                                    const midX = (u.x + v.x) / 2;
                                    const midY = (u.y + v.y) / 2;
                                    let strokeColor = '#94a3b8'; // slate-400 mềm mại trên nền sáng
                                    let strokeWidth = 2.5;
                                    if (isActiveEdge) {
                                        strokeColor = '#0284c7'; // sky-600 rực rỡ
                                        strokeWidth = 4.5;
                                    }
                                    else if (isTraversed) {
                                        strokeColor = activeAlgorithm === 'euler' ? '#059669' : '#7c3aed'; // emerald hoặc violet
                                        strokeWidth = 3.5;
                                    }
                                    return (_jsxs("g", { className: "cursor-pointer group", onClick: (e) => handleEdgeClick(e, edge), children: [_jsx("line", { x1: u.x, y1: u.y, x2: v.x, y2: v.y, stroke: "transparent", strokeWidth: 16 }), _jsx("line", { x1: u.x, y1: u.y, x2: v.x, y2: v.y, stroke: strokeColor, strokeWidth: strokeWidth, strokeLinecap: "round", className: "transition-all duration-200 group-hover:stroke-indigo-400" }), traversalOrder !== undefined && (_jsxs("g", { transform: `translate(${midX}, ${midY})`, children: [_jsx("circle", { r: 11, fill: isActiveEdge ? '#0284c7' : '#059669', stroke: "#ffffff", strokeWidth: 2, className: "shadow-sm" }), _jsx("text", { textAnchor: "middle", dominantBaseline: "central", fill: "#ffffff", fontSize: 10, fontWeight: "bold", className: "font-mono select-none pointer-events-none", children: traversalOrder })] }))] }, edge.id));
                                }) }), _jsx("g", { className: "vertices-group", children: graph.vertices.map(vertex => {
                                    const degInfo = degreeMap.get(vertex.id);
                                    const degree = degInfo?.degree ?? 0;
                                    const isEven = degInfo?.isEven ?? true;
                                    const isSelectedForEdge = edgeSourceVertexId === vertex.id;
                                    const isActiveVertex = currentStep?.activeVertexId === vertex.id;
                                    const isTargetVertex = currentStep?.targetVertexId === vertex.id;
                                    const isVisited = visitedVertexSet.has(vertex.id);
                                    const isBacktracked = currentStep?.backtrackedVertexId === vertex.id;
                                    // Màu sắc đỉnh trên nền sáng: Tinh tế, tương phản cao, dễ nhìn
                                    let fillColor = '#ffffff'; // Nền trắng thanh lịch
                                    let strokeColor = isEven ? '#64748b' : '#f59e0b'; // bậc chẵn slate, bậc lẻ amber nổi bật
                                    let textColor = '#0f172a';
                                    let strokeWidth = 2.5;
                                    let radius = 21;
                                    if (isActiveVertex) {
                                        fillColor = '#e0f2fe'; // sky-100
                                        strokeColor = '#0284c7'; // sky-600
                                        textColor = '#0369a1';
                                        strokeWidth = 3.5;
                                        radius = 23;
                                    }
                                    else if (isTargetVertex) {
                                        fillColor = '#ede9fe'; // violet-100
                                        strokeColor = '#7c3aed';
                                        textColor = '#6d28d9';
                                        strokeWidth = 3;
                                    }
                                    else if (isBacktracked) {
                                        fillColor = '#ffe4e6'; // rose-100
                                        strokeColor = '#e11d48';
                                        textColor = '#be123c';
                                        strokeWidth = 3;
                                    }
                                    else if (isVisited) {
                                        fillColor = '#ecfdf5'; // emerald-50
                                        strokeColor = '#059669';
                                        textColor = '#047857';
                                        strokeWidth = 2.5;
                                    }
                                    if (isSelectedForEdge) {
                                        strokeColor = '#e11d48';
                                        strokeWidth = 3.5;
                                    }
                                    return (_jsxs("g", { transform: `translate(${vertex.x}, ${vertex.y})`, className: "cursor-pointer group", onPointerDown: (e) => handleVertexPointerDown(e, vertex), children: [isActiveVertex && (_jsx("circle", { r: radius + 8, fill: "none", stroke: "#0284c7", strokeWidth: 2, opacity: 0.4, className: "animate-ping" })), isSelectedForEdge && (_jsx("circle", { r: radius + 6, fill: "none", stroke: "#e11d48", strokeWidth: 2, strokeDasharray: "4 4", className: "animate-spin" })), _jsx("circle", { r: radius, fill: fillColor, stroke: strokeColor, strokeWidth: strokeWidth, className: "transition-all duration-200 group-hover:filter group-hover:brightness-95", style: { filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08))' } }), _jsx("text", { textAnchor: "middle", dominantBaseline: "central", fill: textColor, fontSize: 13, fontWeight: "700", className: "select-none pointer-events-none", children: vertex.label }), _jsxs("g", { transform: "translate(15, -15)", children: [_jsx("circle", { r: 9.5, fill: isEven ? '#f1f5f9' : '#fef3c7', stroke: isEven ? '#94a3b8' : '#f59e0b', strokeWidth: 1.5 }), _jsx("text", { textAnchor: "middle", dominantBaseline: "central", fill: isEven ? '#334155' : '#b45309', fontSize: 9.5, fontWeight: "bold", className: "font-mono select-none pointer-events-none", children: degree })] })] }, vertex.id));
                                }) })] }), _jsxs("div", { className: "absolute bottom-2.5 left-3 flex flex-wrap items-center gap-3 px-3 py-1 bg-white/90 border border-slate-200 rounded-lg text-[11px] text-slate-600 shadow-2xs backdrop-blur-xs pointer-events-none", children: [_jsxs("div", { className: "flex items-center gap-1.5 font-medium", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-400" }), _jsx("span", { children: "B\u1EADc ch\u1EB5n" })] }), _jsxs("div", { className: "flex items-center gap-1.5 font-medium", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-500" }), _jsx("span", { children: "B\u1EADc l\u1EBB" })] }), activeAlgorithm && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1.5 font-medium", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-sky-500" }), _jsx("span", { children: "\u0110ang x\u00E9t" })] }), _jsxs("div", { className: "flex items-center gap-1.5 font-medium", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500" }), _jsx("span", { children: "\u0110\u00E3 \u0111i qua" })] })] }))] })] })] }));
};
//# sourceMappingURL=GraphCanvas.js.map