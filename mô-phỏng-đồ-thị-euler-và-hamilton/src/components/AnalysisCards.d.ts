import React from 'react';
import { EulerAnalysis, HamiltonAnalysis } from '../types/graph';
interface AnalysisCardsProps {
    eulerAnalysis: EulerAnalysis;
    hamiltonAnalysis: HamiltonAnalysis;
    activeTab: 'euler' | 'hamilton';
    onSelectTab: (tab: 'euler' | 'hamilton') => void;
    onRunSimulation: (algorithm: 'euler' | 'hamilton') => void;
}
export declare const AnalysisCards: React.FC<AnalysisCardsProps>;
export {};
//# sourceMappingURL=AnalysisCards.d.ts.map