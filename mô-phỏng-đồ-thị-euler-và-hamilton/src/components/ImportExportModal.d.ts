import React from 'react';
import { GraphData } from '../types/graph';
interface ImportExportModalProps {
    isOpen: boolean;
    currentGraph: GraphData;
    onClose: () => void;
    onImportGraph: (importedGraph: GraphData) => void;
}
export declare const ImportExportModal: React.FC<ImportExportModalProps>;
export {};
//# sourceMappingURL=ImportExportModal.d.ts.map