import React from 'react';
import { SimulationStep } from '../types/graph';
interface SimulationControlsProps {
    algorithmName: 'Euler (Hierholzer)' | 'Hamilton (Quay lui Backtracking)';
    totalSteps: number;
    currentStepIndex: number;
    currentStep?: SimulationStep;
    isPlaying: boolean;
    speedMs: number;
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onReset: () => void;
    onSpeedChange: (speedMs: number) => void;
    onSeek: (stepIndex: number) => void;
}
export declare const SimulationControls: React.FC<SimulationControlsProps>;
export {};
//# sourceMappingURL=SimulationControls.d.ts.map