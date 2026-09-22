import { useEffect } from 'react';
import { AlgorithmStep } from '../types';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Layers, 
  X,
  FastForward
} from 'lucide-react';

interface SimulationPlayerProps {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  onSetStepIndex: (index: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  algorithmName: 'Euler (Hierholzer)' | 'Hamilton (Quay lui)' | null;
  onCloseSimulation: () => void;
}

export function SimulationPlayer({
  steps,
  currentStepIndex,
  onSetStepIndex,
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  algorithmName,
  onCloseSimulation,
}: SimulationPlayerProps) {
  const currentStep = steps[currentStepIndex] || null;
  const totalSteps = steps.length;

  // Tự động phát bước tiếp theo
  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return;

    const intervalTime = Math.max(150, 1300 / speed);
    const timer = setInterval(() => {
      onSetStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          onTogglePlay();
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, speed, onTogglePlay, onSetStepIndex]);

  if (totalSteps === 0 || !currentStep) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md p-3.5 text-xs">
      {/* Header dòng 1: Tiêu đề + Nút đóng */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-100">
            Mô phỏng {algorithmName}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-mono border border-slate-700">
            Bước {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tốc độ */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px]">Tốc độ:</span>
            {[0.5, 1, 2].map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono font-medium text-[10px] ${
                  speed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={onCloseSimulation}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Đóng mô phỏng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dòng 2: Nội dung hành động */}
      <div className="py-2.5">
        <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>{currentStep.title}</span>
        </div>
        <p className="text-slate-300 text-[12px] leading-relaxed">
          {currentStep.description}
        </p>

        {/* Chuỗi đường đi hiện thời */}
        {currentStep.currentPath.length > 0 && (
          <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/40 inline-block">
            Đường đi: {currentStep.currentPath.join(' → ')}
          </div>
        )}
      </div>

      {/* Dòng 3: Nút điều hướng */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSetStepIndex(0)}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
            title="Về đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSetStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-medium flex items-center gap-1 transition-colors"
          >
            <SkipBack className="w-3 h-3" />
            <span>Trước</span>
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-3 py-1 rounded font-semibold flex items-center gap-1 transition-colors ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Tự động</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSetStepIndex(Math.min(totalSteps - 1, currentStepIndex + 1))}
            disabled={currentStepIndex >= totalSteps - 1}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Tiếp</span>
            <SkipForward className="w-3 h-3" />
          </button>
        </div>

        {/* Thanh tiến trình */}
        <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all duration-200"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
