import { useState } from 'react';
import { Vertex, Edge } from '../types';
import { 
  Plus, 
  Trash2, 
  Dices, 
  FileText, 
  Edit3, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface GraphEditorControlsProps {
  vertices: Vertex[];
  edges: Edge[];
  onAddVertex: (customLabel?: string) => void;
  onAddEdge: (u: string, v: string) => void;
  onDeleteVertex: (id: string) => void;
  onRenameVertex: (id: string, newLabel: string) => void;
  onImportEdgeList: (rawInput: string) => { added: number; errors: string[] };
  onGenerateRandomGraph: (nodeCount: number, edgeProbability: number) => void;
  selectedVertexId: string | null;
}

export function GraphEditorControls({
  vertices,
  edges,
  onAddVertex,
  onAddEdge,
  onDeleteVertex,
  onRenameVertex,
  onImportEdgeList,
  onGenerateRandomGraph,
  selectedVertexId,
}: GraphEditorControlsProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'manual' | 'random'>('import');

  // Nhập danh sách cạnh
  const [edgeListText, setEdgeListText] = useState('AB, BC, CD, DA');
  const [importStatus, setImportStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Thao tác thủ công
  const [customVertexLabel, setCustomVertexLabel] = useState('');
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');

  // Đổi tên đỉnh
  const [renameLabel, setRenameLabel] = useState('');

  // Đồ thị ngẫu nhiên
  const [randomNodes, setRandomNodes] = useState(5);
  const [randomDensity, setRandomDensity] = useState(0.45);

  const selectedVertex = vertices.find(v => v.id === selectedVertexId);

  const handleImportSubmit = () => {
    if (!edgeListText.trim()) return;
    const res = onImportEdgeList(edgeListText);
    if (res.errors.length > 0) {
      setImportStatus({
        message: `Đã thêm ${res.added} cạnh. Cảnh báo: ${res.errors.slice(0, 2).join('; ')}`,
        type: 'error',
      });
    } else {
      setImportStatus({
        message: `Đã nhập thành công ${res.added} cạnh!`,
        type: 'success',
      });
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleAddEdgeSubmit = () => {
    if (!edgeSource || !edgeTarget || edgeSource === edgeTarget) return;
    onAddEdge(edgeSource, edgeTarget);
    setEdgeSource('');
    setEdgeTarget('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
      {/* Tab chuyển đổi gọn gàng */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-3 text-xs font-medium">
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 py-1 px-2 rounded-md flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'import'
              ? 'bg-white text-indigo-700 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Nhập danh sách cạnh</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-1 px-2 rounded-md flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'manual'
              ? 'bg-white text-indigo-700 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Thủ công</span>
        </button>

        <button
          onClick={() => setActiveTab('random')}
          className={`flex-1 py-1 px-2 rounded-md flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'random'
              ? 'bg-white text-indigo-700 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Dices className="w-3.5 h-3.5" />
          <span>Ngẫu nhiên</span>
        </button>
      </div>

      {/* TAB 1: NHẬP DANH SÁCH CẠNH */}
      {activeTab === 'import' && (
        <div className="space-y-2.5">
          <div>
            <textarea
              rows={2}
              value={edgeListText}
              onChange={e => setEdgeListText(e.target.value)}
              placeholder="VD: AB, BC, CD, DA hoặc 1-2, 2-3, 3-4, 4-1"
              className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Phân cách bằng dấu phẩy. Hỗ trợ dạng chữ cái <code>AB, BC</code> hoặc số có gạch nối <code>1-2, 2-3</code>.
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-2 rounded text-xs flex items-center gap-1.5 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{importStatus.message}</span>
            </div>
          )}

          <button
            onClick={handleImportSubmit}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1 transition-colors"
          >
            <span>Cập nhật đồ thị</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB 2: THỦ CÔNG */}
      {activeTab === 'manual' && (
        <div className="space-y-3">
          {/* Thêm đỉnh */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customVertexLabel}
              onChange={e => setCustomVertexLabel(e.target.value)}
              placeholder="Nhãn đỉnh (VD: X, Y, 5...)"
              maxLength={4}
              className="flex-1 text-xs p-1.5 rounded-lg border border-slate-300"
            />
            <button
              onClick={() => {
                onAddVertex(customVertexLabel.trim() || undefined);
                setCustomVertexLabel('');
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm</span>
            </button>
          </div>

          {/* Nối cạnh */}
          <div className="flex items-center gap-1.5">
            <select
              value={edgeSource}
              onChange={e => setEdgeSource(e.target.value)}
              className="flex-1 text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">Đỉnh đầu</option>
              {vertices.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>

            <span className="text-slate-400 font-bold text-xs">—</span>

            <select
              value={edgeTarget}
              onChange={e => setEdgeTarget(e.target.value)}
              className="flex-1 text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">Đỉnh cuối</option>
              {vertices.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>

            <button
              onClick={handleAddEdgeSubmit}
              disabled={!edgeSource || !edgeTarget || edgeSource === edgeTarget}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              Nối
            </button>
          </div>

          {/* Đổi tên hoặc xóa đỉnh đang chọn */}
          {selectedVertex && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 shrink-0">
                Đỉnh {selectedVertex.label}:
              </span>
              <input
                type="text"
                value={renameLabel}
                onChange={e => setRenameLabel(e.target.value)}
                placeholder="Đổi tên..."
                maxLength={4}
                className="flex-1 text-xs p-1.5 rounded-lg border border-slate-300"
              />
              <button
                onClick={() => {
                  if (renameLabel.trim()) {
                    onRenameVertex(selectedVertex.id, renameLabel.trim());
                    setRenameLabel('');
                  }
                }}
                disabled={!renameLabel.trim()}
                className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40"
              >
                Đổi
              </button>
              <button
                onClick={() => onDeleteVertex(selectedVertex.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                title="Xóa đỉnh này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NGẪU NHIÊN */}
      {activeTab === 'random' && (
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Số đỉnh:</span>
            <span className="font-mono font-bold text-indigo-700">{randomNodes} đỉnh</span>
          </div>
          <input
            type="range"
            min={3}
            max={8}
            value={randomNodes}
            onChange={e => setRandomNodes(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Mật độ cạnh:</span>
            <span className="font-mono font-bold text-indigo-700">{Math.round(randomDensity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.25}
            max={0.75}
            step={0.05}
            value={randomDensity}
            onChange={e => setRandomDensity(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />

          <button
            onClick={() => onGenerateRandomGraph(randomNodes, randomDensity)}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Tạo đồ thị ngẫu nhiên</span>
          </button>
        </div>
      )}
    </div>
  );
}
