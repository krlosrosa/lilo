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
      className={`flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg scale-105 bg-primary/10 border-primary' : ''
      }`}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-accent p-1 rounded transition-colors"
          title="Arrastar para reordenar"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </div>
        <div className="flex items-center gap-2">
          {column.visible ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          )}
          <span className={`font-medium ${column.visible ? 'text-foreground' : 'text-muted-foreground'}`}>
            {column.label}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground min-w-[60px]">
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
          <div className="text-xs text-primary font-medium mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
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
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFilteredColumns = arrayMove(filteredColumns, oldIndex, newIndex);
        
        // Mapear de volta para o array completo, preservando a ordem das colunas filtradas
        const newColumns = pickingColumns.map(col => {
          const foundCol = newFilteredColumns.find(newCol => newCol.key === col.key);
          return foundCol || col;
        });
        
        pickingActions.updateColumnOrder(newColumns);
      }
    }
  };

  // Handlers para FIFO
  const handleFifoDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(fifoColumns, "fifo");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFilteredColumns = arrayMove(filteredColumns, oldIndex, newIndex);
        
        // Mapear de volta para o array completo, preservando a ordem das colunas filtradas
        const newColumns = fifoColumns.map(col => {
          const foundCol = newFilteredColumns.find(newCol => newCol.key === col.key);
          return foundCol || col;
        });
        
        fifoActions.updateColumnOrder(newColumns);
      }
    }
  };

  // Handlers para Pallet
  const handlePalletDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(palletColumns, "pallet");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFilteredColumns = arrayMove(filteredColumns, oldIndex, newIndex);
        
        // Mapear de volta para o array completo, preservando a ordem das colunas filtradas
        const newColumns = palletColumns.map(col => {
          const foundCol = newFilteredColumns.find(newCol => newCol.key === col.key);
          return foundCol || col;
        });
        
        palletActions.updateColumnOrder(newColumns);
      }
    }
  };

  // Handlers para Unidades
  const handleUnidadesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const filteredColumns = filterColumns(unidadesColumns, "unidades");
      const oldIndex = filteredColumns.findIndex(col => col.key === active.id);
      const newIndex = filteredColumns.findIndex(col => col.key === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFilteredColumns = arrayMove(filteredColumns, oldIndex, newIndex);
        
        // Mapear de volta para o array completo, preservando a ordem das colunas filtradas
        const newColumns = unidadesColumns.map(col => {
          const foundCol = newFilteredColumns.find(newCol => newCol.key === col.key);
          return foundCol || col;
        });
        
        unidadesActions.updateColumnOrder(newColumns);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-semibold text-foreground">Configuração de Colunas</h3>
        <p className="text-sm text-muted-foreground">Configure quais colunas serão exibidas nas tabelas de cada tipo</p>
      </div>
      
      <Accordion type="multiple" defaultValue={["picking"]} className="w-full">
        <AccordionItem value="picking">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Tabela Picking</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="Picking"
              icon={<ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
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
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Tabela FIFO</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="FIFO"
              icon={<Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
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
              <Layers className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Tabela Pallet</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="Pallet"
              icon={<Layers className="w-4 h-4 text-green-600 dark:text-green-400" />}
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
              <Package2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Tabela Unidades</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ColumnConfigSection
              title="Unidades"
              icon={<Package2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
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

      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Funcionalidade Ativa</p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Você pode arrastar e soltar as colunas para reordená-las, e usar os switches para mostrar/ocultar colunas específicas em cada tipo de tabela.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 