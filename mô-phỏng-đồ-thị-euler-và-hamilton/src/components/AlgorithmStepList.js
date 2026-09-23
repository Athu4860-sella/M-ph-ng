import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { SimulationStep } from '../types/graph';
import { ListFilter } from 'lucide-react';
export const AlgorithmStepList = ({ steps, currentStepIndex, onSelectStep, }) => {
    if (steps.length <= 1)
        return null;
    return (_jsxs("div", { className: "bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ListFilter, { className: "w-4 h-4 text-indigo-600" }), _jsxs("h4", { className: "text-xs font-bold text-slate-900", children: ["Nh\u1EADt K\u00FD T\u1EEBng B\u01B0\u1EDBc (", steps.length, " b\u01B0\u1EDBc)"] })] }), _jsx("span", { className: "text-[11px] text-slate-500", children: "Nh\u1EA5p b\u01B0\u1EDBc \u0111\u1EC3 xem l\u1EA1i" })] }), _jsx("div", { className: "max-h-48 overflow-y-auto space-y-1.5 pr-0.5 font-mono text-xs", children: steps.map((step, idx) => {
                    const isCurrent = currentStepIndex === idx;
                    let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                    if (step.status === 'traversing' || step.status === 'visiting') {
                        badgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
                    }
                    else if (step.status === 'backtracking') {
                        badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                    }
                    else if (step.status === 'deadend') {
                        badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                    }
                    else if (step.status === 'success') {
                        badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    }
                    return (_jsxs("button", { onClick: () => onSelectStep(idx), className: `w-full text-left p-2 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${isCurrent
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs ring-1 ring-indigo-400'
                            : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100/80'}`, children: [_jsxs("span", { className: `px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 border ${badgeColor}`, children: ["#", idx + 1] }), _jsxs("div", { className: "flex-1 min-w-0 font-sans text-xs", children: [_jsx("p", { className: "font-semibold truncate text-slate-900", children: step.message }), step.currentPath && step.currentPath.length > 0 && (_jsxs("p", { className: "text-[11px] text-slate-500 truncate mt-0.5 font-mono", children: ["\u0110\u01B0\u1EDDng \u0111i: ", step.currentPath.join(' → ')] }))] })] }, idx));
                }) })] }));
};
//# sourceMappingURL=AlgorithmStepList.js.map