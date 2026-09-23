import React from 'react';
import { SimulationStep } from '../types/graph';
interface AlgorithmStepListProps {
    steps: SimulationStep[];
    currentStepIndex: number;
    onSelectStep: (index: number) => void;
}
export declare const AlgorithmStepList: React.FC<AlgorithmStepListProps>;
export {};
//# sourceMappingURL=AlgorithmStepList.d.ts.map