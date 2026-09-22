import { useState } from 'react';
import { EulerResult, HamiltonResult } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  Play, 
  Compass, 
  Sparkles,
  CheckCheck
} from 'lucide-react';

interface ResultsPanelProps {
  eulerResult: EulerResult | null;
  hamiltonResult: HamiltonResult | null;
  onSimulateEuler: () => void;
  onSimulateHamilton: () => void;
  onCheckEuler: () => void;
  onCheckHamilton: () => void;
  onCheckBoth: () => void;
}

export function ResultsPanel({
  eulerResult,
  hamiltonResult,
  onSimulateEuler,
  onSimulateHamilton,
  onCheckEuler,
  onCheckHamilton,
  onCheckBoth,
}: ResultsPanelProps) {
  const [copiedType, setCopiedType] = useState<'euler' | 'hamilton' | null>(null);

  const copyToClipboard = (text: string, type: 'euler' | 'hamilton') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  return (
    <div className="space-y-3">
      {/* 3 nút kích hoạt kiểm tra */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onCheckEuler}
          className="py-2 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Kiểm tra Euler</span>
        </button>

        <button
          onClick={onCheckHamilton}
          className="py-2 px-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kiểm tra Hamilton</span>
        </button>

        <button
          onClick={onCheckBoth}
          className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Kiểm tra cả hai</span>
        </button>
      </div>

      {/* KẾT QUẢ EULER */}
      {eulerResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {eulerResult.isEulerian ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : eulerResult.hasEulerTrail ? (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
              <span className="text-xs font-bold text-slate-900">
                EULER:
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                  eulerResult.isEulerian
                    ? 'bg-emerald-100 text-emerald-800'
                    : eulerResult.hasEulerTrail
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {eulerResult.isEulerian
                  ? 'Có Chu trình Euler'
                  : eulerResult.hasEulerTrail
                  ? 'Có Đường đi Euler'
                  : 'Không có Euler'}
              </span>
            </div>

            {(eulerResult.isEulerian || eulerResult.hasEulerTrail) && (
              <button
                onClick={onSimulateEuler}
                className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold flex items-center gap-1 transition-colors border border-indigo-200"
              >
                <Play className="w-3 h-3 fill-indigo-600" />
                <span>Mô phỏng</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {eulerResult.reason}
          </p>

          {(eulerResult.cycle || eulerResult.trail) && (
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
              <div className="font-mono text-xs font-semibold text-emerald-700 truncate">
                {(eulerResult.cycle || eulerResult.trail || []).join(' → ')}
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    (eulerResult.cycle || eulerResult.trail || []).join(' → '),
                    'euler'
                  )
                }
                className="text-slate-500 hover:text-slate-800 shrink-0 p-1 rounded"
                title="Sao chép kết quả"
              >
                {copiedType === 'euler' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* KẾT QUẢ HAMILTON */}
      {hamiltonResult && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {hamiltonResult.isHamiltonian ? (
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600" />
              )}
              <span className="text-xs font-bold text-slate-900">
                HAMILTON:
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                  hamiltonResult.isHamiltonian
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {hamiltonResult.isHamiltonian
                  ? 'Có Chu trình Hamilton'
                  : 'Không có Hamilton'}
              </span>
            </div>

            <button
              onClick={onSimulateHamilton}
              className="px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center gap-1 transition-colors border border-purple-200"
            >
              <Play className="w-3 h-3 fill-purple-600" />
              <span>Mô phỏng</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {hamiltonResult.reason}
          </p>

          {hamiltonResult.cycle && (
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
              <div className="font-mono text-xs font-semibold text-purple-700 truncate">
                {hamiltonResult.cycle.join(' → ')}
              </div>
              <button
                onClick={() =>
                  copyToClipboard(hamiltonResult.cycle!.join(' → '), 'hamilton')
                }
                className="text-slate-500 hover:text-slate-800 shrink-0 p-1 rounded"
                title="Sao chép kết quả"
              >
                {copiedType === 'hamilton' ? (
                  <Check className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
