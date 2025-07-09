import React from "react";
import { cn } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import { useFifoColumns, type ColumnConfig } from "@/features/mapaSeparacao/presentation/store/columsControlTable";

type TableFifoProps = {
  data: any[];
  ariaLabel?: string;
};

const formatDate = (value: any) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const TableFifo: React.FC<TableFifoProps> = ({ data, ariaLabel = "Tabela FIFO" }) => {
  const visibleColumns = useFifoColumns();
  
  if (!data || data.length === 0) {
    return <div className="text-gray-500 italic">Nenhum dado para exibir.</div>;
  }

  return (
    <div className="w-full">
      {/* Cabeçalho específico FIFO */}
      <div className="bg-orange-50 border justify-center border-orange-200 rounded-t p-2 flex items-center gap-2">
        <Clock className="w-4 h-4 text-orange-600" />
        <span className="font-bold text-orange-700">FIFO</span>
      </div>
      
      <table
        className="table-auto w-full border border-gray-200 text-[10px] bg-white"
        aria-label={ariaLabel}
        role="table"
      >
        <thead className="bg-orange-100">
          <tr>
            {visibleColumns.map((col: ColumnConfig) => (
              <th
                key={col.key}
                className={cn(
                  "px-0.5 py-0.5 border-b border-gray-200 text-left font-semibold",
                  col.key === "sequenciaFifo" ? "text-orange-700 bg-orange-200" : "text-gray-700"
                )}
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
                  "even:bg-orange-25 hover:bg-orange-50 focus-within:bg-orange-100",
                  !isGreenBelt && "font-bold"
                )}
                tabIndex={0}
                aria-label={`Linha ${idx + 1}`}
              >
                {visibleColumns.map((col: ColumnConfig) => {
                  let cellValue = row[col.key];
                  
                  // Adicionar sequência FIFO automaticamente
                  if (col.key === "sequenciaFifo") {
                    cellValue = idx + 1;
                  } else if (col.key === "belt" && isGreenBelt) {
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
                      className={cn(
                        "px-0.5 py-0.5 border-b border-gray-100 text-gray-800",
                        col.key === "sequenciaFifo" && "bg-orange-50 font-bold text-orange-700"
                      )}
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
