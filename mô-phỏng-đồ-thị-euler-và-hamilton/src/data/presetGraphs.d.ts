import { GraphData } from '../types/graph';
export interface PresetGraphItem {
    id: string;
    name: string;
    category: 'euler' | 'hamilton' | 'both' | 'edge_case';
    badge: string;
    description: string;
    graph: GraphData;
}
export declare const PRESET_GRAPHS: PresetGraphItem[];
//# sourceMappingURL=presetGraphs.d.ts.map