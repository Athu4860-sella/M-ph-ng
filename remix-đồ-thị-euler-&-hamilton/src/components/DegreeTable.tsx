import { DegreeInfo } from '../types';
import { Table, Hash, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface DegreeTableProps {
  degrees: DegreeInfo[];
  totalEdges: number;
}

export function DegreeTable({ degrees, totalEdges }: DegreeTableProps) {
  const totalDegreeSum = degrees.reduce((acc, curr) => acc + curr.degree, 0);
  const oddCount = degrees.filter(d => !d.isEven).length;
  const isolatedCount = degrees.filter(d => d.isIsolated).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Table className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Bảng Bậc Các Đỉnh & Thống Kê
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          ∑deg(v) = {totalDegreeSum} (= 2|E| = {2 * totalEdges})
        </span>
      </div>

      {/* Tóm tắt nhanh */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
          <span className="text-xs text-slate-500 block">Số đỉnh / Cạnh</span>
          <span className="text-sm font-bold text-slate-800 font-mono">
            {degrees.length} V / {totalEdges} E
          </span>
        </div>
        <div className={`p-2 rounded-xl border ${oddCount === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <span className="text-xs text-slate-500 block">Đỉnh bậc lẻ</span>
          <span className={`text-sm font-bold font-mono ${oddCount === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {oddCount} đỉnh
          </span>
        </div>
        <div className={`p-2 rounded-xl border ${isolatedCount > 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
          <span className="text-xs text-slate-500 block">Đỉnh cô lập</span>
          <span className={`text-sm font-bold font-mono ${isolatedCount > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
            {isolatedCount} đỉnh
          </span>
        </div>
      </div>

      {/* Bảng danh sách bậc */}
      <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-100">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
            <tr>
              <th className="py-2 px-3 font-semibold">Đỉnh</th>
              <th className="py-2 px-3 font-semibold text-center">Bậc (deg)</th>
              <th className="py-2 px-3 font-semibold text-center">Tính chất</th>
              <th className="py-2 px-3 font-semibold text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {degrees.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                  Chưa có đỉnh nào trong đồ thị
                </td>
              </tr>
            ) : (
              degrees.map(d => (
                <tr key={d.vertexId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 font-bold text-slate-900 font-mono">
                    {d.label}
                  </td>
                  <td className="py-2 px-3 font-mono font-semibold text-center text-slate-800">
                    {d.degree}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        d.isEven
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {d.isEven ? 'Bậc chẵn' : 'Bậc lẻ'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    {d.isIsolated ? (
                      <span className="text-rose-600 font-medium">Cô lập</span>
                    ) : (
                      <span className="text-slate-500">Liên kết</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
