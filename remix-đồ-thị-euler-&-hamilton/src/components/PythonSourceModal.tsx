import { useState } from 'react';
import { 
  PYTHON_CLI_CODE, 
  PYTHON_STREAMLIT_CODE, 
  GOOGLE_COLAB_INSTRUCTIONS 
} from '../data/pythonSourceCode';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Code2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface PythonSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PythonSourceModal({ isOpen, onClose }: PythonSourceModalProps) {
  const [activeTab, setActiveTab] = useState<'cli' | 'streamlit' | 'colab'>('cli');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = 
    activeTab === 'cli' 
      ? PYTHON_CLI_CODE 
      : activeTab === 'streamlit' 
      ? PYTHON_STREAMLIT_CODE 
      : GOOGLE_COLAB_INSTRUCTIONS + "\n\n" + PYTHON_CLI_CODE;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'streamlit' ? 'app_streamlit.py' : 'euler_hamilton.py';
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Mã Nguồn Python Hoàn Chỉnh (NetworkX & Matplotlib)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Chạy độc lập trên máy tính cá nhân hoặc Google Colab với menu tiếng Việt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900/90 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('cli')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'cli'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Python CLI / Colab (.py)</span>
            </button>

            <button
              onClick={() => setActiveTab('streamlit')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'streamlit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Giao Diện Web Streamlit</span>
            </button>

            <button
              onClick={() => setActiveTab('colab')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'colab'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hướng Dẫn Google Colab</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-sm font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file .py</span>
            </button>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="whitespace-pre">{currentCode}</pre>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex items-center justify-between">
          <span>
            Thư viện cần cài đặt: <code className="text-indigo-400 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-800/40">pip install networkx matplotlib streamlit</code>
          </span>
          <a
            href="https://colab.research.google.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <span>Mở Google Colab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
