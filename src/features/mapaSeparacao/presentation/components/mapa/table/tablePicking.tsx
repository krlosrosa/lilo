import React from "react";
import { cn } from "@/lib/utils";
import { ClipboardList, Package2 } from "lucide-react";
import { usePickingColumns, type ColumnConfig } from "@/features/mapaSeparacao/presentation/store/columsControlTable";

type TablePickingProps = {
  data: any[];
  ariaLabel?: string;
};

const formatDate = (value: any) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const TablePicking: React.FC<TablePickingProps> = ({ data, ariaLabel = "Tabela Picking" }) => {
  const visibleColumns = usePickingColumns();
  
  if (!data || data.length === 0) {
    return <div className="text-gray-500 italic">Nenhum dado para exibir.</div>;
  }

  return (
    <div className="w-full">
      {/* Cabeçalho específico Picking */}
      <div className="bg-blue-50 border justify-center border-blue-200 rounded-t p-2 flex items-center gap-2">
        <ClipboardList className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-blue-700">SEPARAÇÃO POR PICKING</span>
      </div>
      
      <table
        className="table-auto w-full border border-gray-200 text-[10px] bg-white"
        aria-label={ariaLabel}
        role="table"
      >
        <thead className="bg-blue-100">
          <tr>
            {visibleColumns.map((col: ColumnConfig) => (
              <th
                key={col.key}
                className="px-0.5 py-0.5 border-b border-gray-200 text-left font-semibold text-gray-700"
                tabIndex={0}
                aria-label={`Coluna ${col.label}`}
                scope="col"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const isGreenBelt = row.belt === "verde" || row.belt === "Verde";
            return (
              <tr
                key={idx}
                className={cn(
                  "even:bg-blue-25 hover:bg-blue-50 focus-within:bg-blue-100 text-[11px] font-semibold",
                  !isGreenBelt && "font-semibold bg-slate-300"
                )}
                tabIndex={0}
                aria-label={`Linha ${idx + 1}`}
              >
                {visibleColumns.map((col: ColumnConfig) => {
                  let cellValue = row[col.key];
                  
                  // Se for a coluna belt e for verde, mostra vazio
                  if (col.key === "belt" && isGreenBelt) {
                    cellValue = "";
                  } else if (col.key === "address" && cellValue) {
                    cellValue = String(cellValue).substring(0, 10);
                  } else if ((col.key === "dataMinima" || col.key === "dataMaxima" || col.key === "manufacturingDate") && cellValue) {
                    cellValue = formatDate(cellValue);
                  } else if (cellValue !== undefined && cellValue !== null && typeof cellValue === "object") {
                    cellValue = JSON.stringify(cellValue);
                  } else if (cellValue === undefined || cellValue === null) {
                    cellValue = "";
                  } else {
                    cellValue = String(cellValue);
                  }
                  
                  return (
                    <td
                      key={col.key}
                      className="px-0.5 py-0.5 border-b border-gray-100 text-gray-800"
                      tabIndex={0}
                      aria-label={`Valor ${cellValue}`}
                    >
                      {cellValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
