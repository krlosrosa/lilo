import React from "react";
import { TableFifo } from "./table/tableFifo";
import { TablePallet } from "./table/tablePallet";
import { TablePicking } from "./table/tablePicking";
import { TableUnidades } from "./table/tableUnidades";

type TableProps = {
  data: any[];
  ariaLabel?: string;
  caminho?: string;
};

export const Table: React.FC<TableProps> = ({ data, ariaLabel = "Tabela de dados", caminho }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 italic">Nenhum dado para exibir.</div>;
  }

  const tipo = caminho?.split(' > ').find(item => item.includes('tipo:'))?.replace('tipo:', '');
  const transporteAtual = caminho?.split(' > ').find(item => item.includes('transporte:'))?.replace('transporte:', '');

  // Renderizar a tabela específica baseada no tipo
  if (tipo?.toUpperCase().includes('2-FIFO')) {
    return <TableFifo data={data} ariaLabel={ariaLabel} transporteAtual={transporteAtual} />;
  }
  
  if (tipo?.toUpperCase().includes('0-PALLET')) {
    return <TablePallet data={data} ariaLabel={ariaLabel} transporteAtual={transporteAtual} />;
  }
  
  if (tipo?.toUpperCase().includes('PICKING')) {
    return <TablePicking data={data} ariaLabel={ariaLabel} transporteAtual={transporteAtual} />;
  }
  
  if (tipo?.toUpperCase().includes('3-UNIDADES')) {
    return <TableUnidades data={data} ariaLabel={ariaLabel} transporteAtual={transporteAtual} />;
  }

  // Se não corresponder a nenhum tipo específico, usar a tabela padrão (picking)
  return <TablePicking data={data} ariaLabel={ariaLabel} transporteAtual={transporteAtual} />;
};
