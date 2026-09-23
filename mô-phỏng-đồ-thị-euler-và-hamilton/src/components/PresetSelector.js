import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import { GraphData } from '../types/graph';
import { FolderGit2 } from 'lucide-react';
export const PresetSelector = ({ currentGraphId, onSelectPreset, }) => {
    const [filter, setFilter] = useState('all');
    const filteredPresets = PRESET_GRAPHS.filter(p => {
        if (filter === 'all')
            return true;
        if (filter === 'euler')
            return p.category === 'euler' || p.category === 'both';
        if (filter === 'hamilton')
            return p.category === 'hamilton' || p.category === 'both';
        if (filter === 'edge_case')
            return p.category === 'edge_case';
        return true;
    });
    return (_jsxs("div", { className: "bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col gap-3", children: [_jsx("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2.5", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FolderGit2, { className: "w-4 h-4 text-indigo-600" }), _jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Th\u01B0 Vi\u1EC7n \u0110\u1ED3 Th\u1ECB M\u1EABu" })] }) }), _jsxs("div", { className: "flex items-center gap-1 overflow-x-auto pb-0.5 text-xs", children: [_jsxs("button", { onClick: () => setFilter('all'), className: `px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${filter === 'all'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`, children: ["T\u1EA5t c\u1EA3 (", PRESET_GRAPHS.length, ")"] }), _jsx("button", { onClick: () => setFilter('euler'), className: `px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${filter === 'euler'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`, children: "Euler" }), _jsx("button", { onClick: () => setFilter('hamilton'), className: `px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${filter === 'hamilton'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`, children: "Hamilton" }), _jsx("button", { onClick: () => setFilter('edge_case'), className: `px-2.5 py-1 rounded-lg transition-all whitespace-nowrap font-medium cursor-pointer ${filter === 'edge_case'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`, children: "R\u1EDDi r\u1EA1c & Bi\u00EAn" })] }), _jsx("div", { className: "flex flex-col gap-2 max-h-56 overflow-y-auto pr-0.5", children: filteredPresets.map(preset => {
                    const isSelected = currentGraphId === preset.id;
                    return (_jsxs("button", { onClick: () => onSelectPreset(preset.graph, preset.id), className: `p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${isSelected
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-400 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-xs text-slate-900 flex items-center gap-1.5", children: preset.name }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded-md bg-white text-indigo-700 border border-slate-200 font-mono font-medium shadow-2xs", children: preset.badge })] }), _jsx("p", { className: "text-[11px] text-slate-600 line-clamp-2 leading-relaxed", children: preset.description })] }, preset.id));
                }) })] }));
};
//# sourceMappingURL=PresetSelector.js.map