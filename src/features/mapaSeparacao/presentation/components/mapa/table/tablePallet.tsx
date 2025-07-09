import React from "react";
import { cn } from "@/lib/utils";
import { Layers, Package } from "lucide-react";
import { usePalletColumns, type ColumnConfig } from "@/features/mapaSeparacao/presentation/store/columsControlTable";

type TablePalletProps = {
  data: any[];
  ariaLabel?: string;
};

const formatDate = (value: any) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const TablePallet: React.FC<TablePalletProps> = ({ data, ariaLabel = "Tabela Pallets" }) => {
  const visibleColumns = usePalletColumns();
  
  if (!data || data.length === 0) {
    return <div className="text-gray-500 italic">Nenhum dado para exibir.</div>;
  }

  return (
    <div className="w-full">
      <table
        className="table-auto w-full border border-gray-200 text-[10px] bg-white"
        aria-label={ariaLabel}
        role="table"
      >
        <thead className="bg-green-100">
          <tr>
            {visibleColumns.map((col: ColumnConfig) => (
              <th
                key={col.key}
                className={cn(
                  "px-0.5 py-0.5 border-b border-gray-200 text-left font-semibold",
                  col.key === "Pallets" ? "text-green-700 bg-green-200" : "text-gray-700"
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
            const isPallet = row.Pallets && row.Pallets > 0;
            return (
              <tr
                key={idx}
                className={cn(
                  "even:bg-green-25 hover:bg-green-50 focus-within:bg-green-100",
                  !isGreenBelt && "font-bold",
                  isPallet && "bg-green-50"
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
                      className={cn(
                        "px-0.5 py-0.5 border-b border-gray-100 text-gray-800",
                        col.key === "Pallets" && "bg-green-50 font-bold text-green-700"
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
