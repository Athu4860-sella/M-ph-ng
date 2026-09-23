import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { GraphData } from '../types/graph';
import { parseEdgeList, exportToEdgeList } from '../utils/graphModel';
import { X, FileText, Check, AlertTriangle, Copy, Upload } from 'lucide-react';
export const ImportExportModal = ({ isOpen, currentGraph, onClose, onImportGraph, }) => {
    const [inputText, setInputText] = useState(() => exportToEdgeList(currentGraph));
    const [errorMessage, setErrorMessage] = useState(null);
    const [copied, setCopied] = useState(false);
    if (!isOpen)
        return null;
    const handleImport = () => {
        setErrorMessage(null);
        const result = parseEdgeList(inputText, 600, 500);
        if (result.error) {
            setErrorMessage(result.error);
            return;
        }
        if (result.graph) {
            onImportGraph(result.graph);
            onClose();
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(inputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs", children: _jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 text-slate-800 animate-in fade-in zoom-in-95 duration-150", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "w-5 h-5 text-indigo-600" }), _jsx("h3", { className: "font-bold text-sm text-slate-900", children: "Nh\u1EADp / Xu\u1EA5t Danh S\u00E1ch C\u1EA1nh \u0110\u1ED3 Th\u1ECB" })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80", children: [_jsx("strong", { className: "text-slate-900 block mb-1", children: "Quy c\u00E1ch \u0111\u1ECBnh d\u1EA1ng:" }), "M\u1ED7i d\u00F2ng bi\u1EC3u di\u1EC5n m\u1ED9t c\u1EA1nh g\u1ED3m hai \u0111\u1EC9nh c\u00E1ch nhau b\u1EDFi d\u1EA5u c\u00E1ch ho\u1EB7c d\u1EA5u g\u1EA1ch n\u1ED1i. V\u00ED d\u1EE5:", _jsx("pre", { className: "font-mono text-indigo-700 mt-1.5 p-2 bg-white rounded-lg border border-slate-200 text-[11px]", children: `A B
B C
C A
D` }), _jsx("em", { className: "text-slate-500 mt-1 block", children: "* Ghi ch\u00FA: D\u00F2ng ch\u1EC9 c\u00F3 m\u1ED9t \u0111\u1EC9nh \u0111\u1EA1i di\u1EC7n cho \u0111\u1EC9nh c\u00F4 l\u1EADp (nh\u01B0 \u0111\u1EC9nh D). \u0110\u1ED3 th\u1ECB v\u00F4 h\u01B0\u1EDBng kh\u00F4ng cho ph\u00E9p c\u1EA1nh khuy\u00EAn (A A)." })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-slate-700", children: "Danh s\u00E1ch c\u1EA1nh:" }), _jsx("textarea", { rows: 7, value: inputText, onChange: (e) => {
                                setInputText(e.target.value);
                                setErrorMessage(null);
                            }, placeholder: "V\u00ED d\u1EE5:\n1 2\n2 3\n3 1", className: "w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all resize-none" })] }), errorMessage && (_jsxs("div", { className: "flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs", children: [_jsx(AlertTriangle, { className: "w-4 h-4 shrink-0 mt-0.5 text-rose-600" }), _jsx("span", { children: errorMessage })] })), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-slate-100", children: [_jsxs("button", { onClick: handleCopy, className: "flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer font-medium", children: [copied ? _jsx(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : _jsx(Copy, { className: "w-3.5 h-3.5" }), _jsx("span", { children: copied ? 'Đã sao chép' : 'Sao chép văn bản' })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: onClose, className: "px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer", children: "H\u1EE7y" }), _jsxs("button", { onClick: handleImport, className: "flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer", children: [_jsx(Upload, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "N\u1EA1p v\u00E0o \u0110\u1ED3 Th\u1ECB" })] })] })] })] }) }));
};
//# sourceMappingURL=ImportExportModal.js.map