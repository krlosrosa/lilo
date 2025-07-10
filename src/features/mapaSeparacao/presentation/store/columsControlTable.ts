import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useConfigPrintStore } from './configPrint';
import { arrayMove } from '@dnd-kit/sortable';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

interface ColumnsControlState {
  // Configurações das colunas para cada tipo de tabela
  pickingColumns: ColumnConfig[];
  fifoColumns: ColumnConfig[];
  palletColumns: ColumnConfig[];
  unidadesColumns: ColumnConfig[];
  
  // Actions para picking
  togglePickingColumn: (key: string) => void;
  reorderPickingColumns: (activeId: string, overId: string) => void;
  resetPickingColumns: () => void;
  updatePickingColumnOrder: (columns: ColumnConfig[]) => void;
  
  // Actions para FIFO
  toggleFifoColumn: (key: string) => void;
  reorderFifoColumns: (activeId: string, overId: string) => void;
  resetFifoColumns: () => void;
  updateFifoColumnOrder: (columns: ColumnConfig[]) => void;
  
  // Actions para Pallet
  togglePalletColumn: (key: string) => void;
  reorderPalletColumns: (activeId: string, overId: string) => void;
  resetPalletColumns: () => void;
  updatePalletColumnOrder: (columns: ColumnConfig[]) => void;
  
  // Actions para Unidades
  toggleUnidadesColumn: (key: string) => void;
  reorderUnidadesColumns: (activeId: string, overId: string) => void;
  resetUnidadesColumns: () => void;
  updateUnidadesColumnOrder: (columns: ColumnConfig[]) => void;
}

// Configuração padrão das colunas para picking
const defaultPickingColumns: ColumnConfig[] = [
  { key: "address", label: "Endereço", visible: true, order: 0 },
  { key: "skuCode", label: "Sku", visible: true, order: 1 },
  { key: "skuDescription", label: "Descrição", visible: true, order: 2 },
  { key: "boxes", label: "Cx", visible: true, order: 3 },
  { key: "units", label: "Un", visible: true, order: 4 },
  { key: "Pallets", label: "Plt", visible: true, order: 5 },
  { key: "batch", label: "Lote", visible: true, order: 6 },
  { key: "dataMinima", label: "Data mínima", visible: true, order: 7 },
  { key: "dataMaxima", label: "Data máxima", visible: true, order: 8 },
  { key: "belt", label: "Faixa", visible: true, order: 9 },
  { key: "manufacturingDate", label: "Data de fabricação", visible: true, order: 10 },
];

// Configuração padrão das colunas para FIFO
const defaultFifoColumns: ColumnConfig[] = [
  { key: "address", label: "Endereço", visible: true, order: 0 },
  { key: "skuCode", label: "Sku", visible: true, order: 1 },
  { key: "skuDescription", label: "Descrição", visible: true, order: 2 },
  { key: "batch", label: "Lote", visible: true, order: 3 },
  { key: "manufacturingDate", label: "Data de fabricação", visible: true, order: 4 },
  { key: "belt", label: "Faixa", visible: true, order: 5 },
  { key: "boxes", label: "Cx", visible: true, order: 6 },
  { key: "units", label: "Un", visible: true, order: 7 },
  { key: "Pallets", label: "Plt", visible: true, order: 8 },
];

// Configuração padrão das colunas para Pallet
const defaultPalletColumns: ColumnConfig[] = [
  { key: "skuCode", label: "Sku", visible: true, order: 0 },
  { key: "skuDescription", label: "Descrição", visible: true, order: 1 },
  { key: "batch", label: "Lote", visible: true, order: 2 },
  { key: "belt", label: "Faixa", visible: true, order: 3 },
  { key: "dataMinima", label: "Data mínima", visible: true, order: 4 },
  { key: "dataMaxima", label: "Data máxima", visible: true, order: 5 },
  { key: "Pallets", label: "Plt", visible: true, order: 6 },
  { key: "manufacturingDate", label: "Data de fabricação", visible: true, order: 7 },
];

// Configuração padrão das colunas para Unidades
const defaultUnidadesColumns: ColumnConfig[] = [
  { key: "address", label: "Endereço", visible: true, order: 0 },
  { key: "skuCode", label: "Sku", visible: true, order: 1 },
  { key: "skuDescription", label: "Descrição", visible: true, order: 2 },
  { key: "batch", label: "Lote", visible: true, order: 3 },
  { key: "dataMinima", label: "Data mínima", visible: true, order: 4 },
  { key: "dataMaxima", label: "Data máxima", visible: true, order: 5 },
  { key: "belt", label: "Faixa", visible: true, order: 6 },
  { key: "units", label: "Un", visible: true, order: 7 },
  { key: "manufacturingDate", label: "Data de fabricação", visible: true, order: 8 },
];

export const useColumnsControlStore = create<ColumnsControlState>()(
  persist(
    (set, get) => ({
      pickingColumns: defaultPickingColumns,
      fifoColumns: defaultFifoColumns,
      palletColumns: defaultPalletColumns,
      unidadesColumns: defaultUnidadesColumns,

      // Actions para picking
      togglePickingColumn: (key: string) => {
        set((state) => ({
          pickingColumns: state.pickingColumns.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
          )
        }));
      },

      reorderPickingColumns: (activeId: string, overId: string) => {
        set((state) => {
          const oldIndex = state.pickingColumns.findIndex((col) => col.key === activeId);
          const newIndex = state.pickingColumns.findIndex((col) => col.key === overId);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(state.pickingColumns, oldIndex, newIndex);
            return { 
              pickingColumns: reordered.map((col, index) => ({ ...col, order: index })) 
            };
          }
          return {};
        });
      },

      resetPickingColumns: () => {
        set({ pickingColumns: defaultPickingColumns });
      },

      updatePickingColumnOrder: (columns: ColumnConfig[]) => {
        set({ pickingColumns: columns });
      },

      // Actions para FIFO
      toggleFifoColumn: (key: string) => {
        set((state) => ({
          fifoColumns: state.fifoColumns.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
          )
        }));
      },

      reorderFifoColumns: (activeId: string, overId: string) => {
        set((state) => {
          const oldIndex = state.fifoColumns.findIndex((col) => col.key === activeId);
          const newIndex = state.fifoColumns.findIndex((col) => col.key === overId);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(state.fifoColumns, oldIndex, newIndex);
            return { 
              fifoColumns: reordered.map((col, index) => ({ ...col, order: index })) 
            };
          }
          return {};
        });
      },

      resetFifoColumns: () => {
        set({ fifoColumns: defaultFifoColumns });
      },

      updateFifoColumnOrder: (columns: ColumnConfig[]) => {
        set({ fifoColumns: columns });
      },

      // Actions para Pallet
      togglePalletColumn: (key: string) => {
        set((state) => ({
          palletColumns: state.palletColumns.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
          )
        }));
      },

      reorderPalletColumns: (activeId: string, overId: string) => {
        set((state) => {
          const oldIndex = state.palletColumns.findIndex((col) => col.key === activeId);
          const newIndex = state.palletColumns.findIndex((col) => col.key === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(state.palletColumns, oldIndex, newIndex);
            return { 
              palletColumns: reordered.map((col, index) => ({ ...col, order: index })) 
            };
          }
          return {};
        });
      },

      resetPalletColumns: () => {
        set({ palletColumns: defaultPalletColumns });
      },

      updatePalletColumnOrder: (columns: ColumnConfig[]) => {
        set({ palletColumns: columns });
      },

      // Actions para Unidades
      toggleUnidadesColumn: (key: string) => {
        set((state) => ({
          unidadesColumns: state.unidadesColumns.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
          )
        }));
      },

      reorderUnidadesColumns: (activeId: string, overId: string) => {
        set((state) => {
          const oldIndex = state.unidadesColumns.findIndex((col) => col.key === activeId);
          const newIndex = state.unidadesColumns.findIndex((col) => col.key === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(state.unidadesColumns, oldIndex, newIndex);
            return { 
              unidadesColumns: reordered.map((col, index) => ({ ...col, order: index })) 
            };
          }
          return {};
        });
      },

      resetUnidadesColumns: () => {
        set({ unidadesColumns: defaultUnidadesColumns });
      },

      updateUnidadesColumnOrder: (columns: ColumnConfig[]) => {
        set({ unidadesColumns: columns });
      },
    }),
    {
      name: 'columns-control-storage',
    }
  )
);

// Função helper para filtrar colunas baseado na configuração
const filterColumnsByConfig = (columns: ColumnConfig[], tableType?: string, configPrint?: any): ColumnConfig[] => {
  if (!configPrint) return columns;
  
  return columns.filter(col => {
    // Filtrar coluna "Pallets" quando palletsFull for true e NÃO for separação por pallet
    if (configPrint.palletsFull && col.key === "Pallets" && tableType !== "pallet") {
      return false;
    }
    
    // Filtrar coluna "units" quando unidadesSeparadas for true e for tabela picking
    if (configPrint.unidadesSeparadas && col.key === "units" && tableType === "picking") {
      return false;
    }
    
    // Filtrar colunas "dataMinima" e "dataMaxima" quando isRange for false
    if (!configPrint.isRange && (col.key === "dataMinima" || col.key === "dataMaxima")) {
      return false;
    }
    
    return true;
  });
};

// Hook helper para obter colunas visíveis ordenadas
export const usePickingColumns = () => {
  const { pickingColumns } = useColumnsControlStore();
  const { config: configPrint } = useConfigPrintStore();
  
  const filteredColumns = filterColumnsByConfig(pickingColumns, "picking", configPrint);
  
  return filteredColumns
    .filter((col: ColumnConfig) => col.visible)
    .sort((a: ColumnConfig, b: ColumnConfig) => a.order - b.order);
};

export const useFifoColumns = () => {
  const { fifoColumns } = useColumnsControlStore();
  const { config: configPrint } = useConfigPrintStore();
  
  const filteredColumns = filterColumnsByConfig(fifoColumns, "fifo", configPrint);
  
  return filteredColumns
    .filter((col: ColumnConfig) => col.visible)
    .sort((a: ColumnConfig, b: ColumnConfig) => a.order - b.order);
};

export const usePalletColumns = () => {
  const { palletColumns } = useColumnsControlStore();
  const { config: configPrint } = useConfigPrintStore();
  
  const filteredColumns = filterColumnsByConfig(palletColumns, "pallet", configPrint);
  
  return filteredColumns
    .filter((col: ColumnConfig) => col.visible)
    .sort((a: ColumnConfig, b: ColumnConfig) => a.order - b.order);
};

export const useUnidadesColumns = () => {
  const { unidadesColumns } = useColumnsControlStore();
  const { config: configPrint } = useConfigPrintStore();
  
  const filteredColumns = filterColumnsByConfig(unidadesColumns, "unidades", configPrint);
  
  return filteredColumns
    .filter((col: ColumnConfig) => col.visible)
    .sort((a: ColumnConfig, b: ColumnConfig) => a.order - b.order);
};

// Hook helper para actions de picking
export const usePickingColumnActions = () => {
  const { togglePickingColumn, reorderPickingColumns, resetPickingColumns, updatePickingColumnOrder } = useColumnsControlStore();
  
  return {
    toggleColumn: togglePickingColumn,
    reorderColumns: reorderPickingColumns,
    resetColumns: resetPickingColumns,
    updateColumnOrder: updatePickingColumnOrder,
  };
};

export const useFifoColumnActions = () => {
  const { toggleFifoColumn, reorderFifoColumns, resetFifoColumns, updateFifoColumnOrder } = useColumnsControlStore();
  
  return {
    toggleColumn: toggleFifoColumn,
    reorderColumns: reorderFifoColumns,
    resetColumns: resetFifoColumns,
    updateColumnOrder: updateFifoColumnOrder,
  };
};

export const usePalletColumnActions = () => {
  const { togglePalletColumn, reorderPalletColumns, resetPalletColumns, updatePalletColumnOrder } = useColumnsControlStore();
  
  return {
    toggleColumn: togglePalletColumn,
    reorderColumns: reorderPalletColumns,
    resetColumns: resetPalletColumns,
    updateColumnOrder: updatePalletColumnOrder,
  };
};

export const useUnidadesColumnActions = () => {
  const { toggleUnidadesColumn, reorderUnidadesColumns, resetUnidadesColumns, updateUnidadesColumnOrder } = useColumnsControlStore();
  
  return {
    toggleColumn: toggleUnidadesColumn,
    reorderColumns: reorderUnidadesColumns,
    resetColumns: resetUnidadesColumns,
    updateColumnOrder: updateUnidadesColumnOrder,
  };
};
