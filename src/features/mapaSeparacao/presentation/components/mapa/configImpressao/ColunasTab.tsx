import { Dispatch, SetStateAction, useState } from "react";
import { 
  useColumnsControlStore, 
  usePickingColumnActions, 
  useFifoColumnActions,
  usePalletColumnActions,
  useUnidadesColumnActions,
  type ColumnConfig 
} from "../../../store/columsControlTable";
import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";
import { useConfigPrintStore } from "../../../store/configPrint";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, EyeOff, RotateCcw, GripVertical, ClipboardList, Clock, Layers, Package2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ColunasTabProps = {
  config: PropsConfig;
  setConfig: Dispatch<SetStateAction<PropsConfig>>;
};

type SortableColumnItemProps = {
  column: ColumnConfig;
  onToggle: (key: string) => void;
};

type ColumnConfigSectionProps = {
  title: string;
  icon: React.ReactNode;
  columns: ColumnConfig[];
  onToggle: (key: string) => void;
  onReset: () => void;
  onDragEnd: (event: DragEndEvent) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
};

const SortableColumnItem: React.FC<SortableColumnItemProps> = ({ column, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg scale-105 bg-blue-50 border-blue-300' : ''
      }`}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-gray-200 p-1 rounded transition-colors"
          title="Arrastar para reordenar"
        >
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div>
        <div className="flex items-center gap-2">
          {column.visible ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
          <span className={`font-medium ${column.visible ? 'text-gray-900' : 'text-gray-500'}`}>
            {column.label}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 min-w-[60px]">
          Ordem: {column.order + 1}
        </span>
        <Switch
          checked={column.visible}
          onCheckedChange={() => onToggle(column.key)}
          aria-label={`Mostrar/ocultar coluna ${column.label}`}
        />
      </div>
    </div>
  );
};

const ColumnConfigSection: React.FC<ColumnConfigSectionProps> = ({ 
  title, 
  icon, 
  columns, 
  onToggle, 
  onReset, 
  onDragEnd, 
  isDragging, 
  setIsDragging 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    onDragEnd(event);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isDragging && (
          <div className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Reordenando colunas...
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map(col => col.key)}
            strategy={verticalListSortingStrategy}
          >
            {columns.map((column: ColumnConfig) => (
              <SortableColumnItem
                key={column.key}
                column={column}
                onToggle={onToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

export const ColunasTab: React.FC<ColunasTabProps> = ({ config, setConfig }) => {
  const { pickingColumns, fifoColumns, palletColumns, unidadesColumns } = useColumnsControlStore();
  const { config: configPrint } = useConfigPrintStore();
  const pickingActions = usePickingColumnActions();
  const fifoActions = useFifoColumnActions();
  const palletActions = usePalletColumnActions();
  const unidadesActions = useUnidadesColumnActions();
  const [isDragging, setIsDragging] = useState(false);

  // Função helper para filtrar colunas baseado na configuração
  const filterColumns = (columns: ColumnConfig[], tableType?: string): ColumnConfig[] => {
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

  // Handlers para Picking
  const handlePickingDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(pickingColumns, "picking");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      const newColumns = arrayMove(filteredColumns, oldIndex, newIndex).map((col, index) => ({
        ...col,
        order: index
      }));
      
      // Manter as colunas não filtradas e atualizar apenas as filtradas
      const finalColumns = pickingColumns.map(col => {
        const foundCol = newColumns.find(newCol => newCol.key === col.key);
        return foundCol || col;
      });
      
      pickingActions.updateColumnOrder(finalColumns);
    }
  };

  // Handlers para FIFO
  const handleFifoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(fifoColumns, "fifo");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      const newColumns = arrayMove(filteredColumns, oldIndex, newIndex).map((col, index) => ({
        ...col,
        order: index
      }));
      
      // Manter as colunas não filtradas e atualizar apenas as filtradas
      const finalColumns = fifoColumns.map(col => {
        const foundCol = newColumns.find(newCol => newCol.key === col.key);
        return foundCol || col;
      });
      
      fifoActions.updateColumnOrder(finalColumns);
    }
  };

  // Handlers para Pallet
  const handlePalletDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(palletColumns, "pallet");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      const newColumns = arrayMove(filteredColumns, oldIndex, newIndex).map((col, index) => ({
        ...col,
        order: index
      }));
      
      // Manter as colunas não filtradas e atualizar apenas as filtradas
      const finalColumns = palletColumns.map(col => {
        const foundCol = newColumns.find(newCol => newCol.key === col.key);
        return foundCol || col;
      });
      
      palletActions.updateColumnOrder(finalColumns);
    }
  };

  // Handlers para Unidades
  const handleUnidadesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(unidadesColumns, "unidades");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      const newColumns = arrayMove(filteredColumns, oldIndex, newIndex).map((col, index) => ({
        ...col,
        order: index
      }));
      
      // Manter as colunas não filtradas e atualizar apenas as filtradas
      const finalColumns = unidadesColumns.map(col => {
        const foundCol = newColumns.find(newCol => newCol.key === col.key);
        return foundCol || col;
      });
      
      unidadesActions.updateColumnOrder(finalColumns);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Configuração de Colunas</h3>
        <p className="text-sm text-gray-600">Configure quais colunas serão exibidas nas tabelas de cada tipo</p>
      </div>
      
      <Accordion type="multiple" defaultValue={["picking"]} className="w-full">
        <AccordionItem value="picking">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>Tabela Picking</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="Picking"
              icon={<ClipboardList className="w-4 h-4 text-blue-600" />}
              columns={filterColumns(pickingColumns, "picking")}
              onToggle={pickingActions.toggleColumn}
              onReset={pickingActions.resetColumns}
              onDragEnd={handlePickingDragEnd}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fifo">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span>Tabela FIFO</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="FIFO"
              icon={<Clock className="w-4 h-4 text-orange-600" />}
              columns={filterColumns(fifoColumns, "fifo")}
              onToggle={fifoActions.toggleColumn}
              onReset={fifoActions.resetColumns}
              onDragEnd={handleFifoDragEnd}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pallet">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-600" />
              <span>Tabela Pallet</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="Pallet"
              icon={<Layers className="w-4 h-4 text-green-600" />}
              columns={filterColumns(palletColumns, "pallet")}
              onToggle={palletActions.toggleColumn}
              onReset={palletActions.resetColumns}
              onDragEnd={handlePalletDragEnd}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="unidades">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Package2 className="w-4 h-4 text-purple-600" />
              <span>Tabela Unidades</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="Unidades"
              icon={<Package2 className="w-4 h-4 text-purple-600" />}
              columns={filterColumns(unidadesColumns, "unidades")}
              onToggle={unidadesActions.toggleColumn}
              onReset={unidadesActions.resetColumns}
              onDragEnd={handleUnidadesDragEnd}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-green-900">Funcionalidade Ativa</p>
            <p className="text-xs text-green-700 mt-1">
              Você pode arrastar e soltar as colunas para reordená-las, e usar os switches para mostrar/ocultar colunas específicas em cada tipo de tabela.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 