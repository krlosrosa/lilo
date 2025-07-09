import React from "react";
import { FifoHeader } from './headers/fifoHeader';
import { PalletFullHeader } from './headers/palletFullHeader';
import { PickingHeader } from './headers/pickingHeader';
import { UnidadeHeader } from './headers/unidadeHeader';

type HeaderProps = {
  header: {
    group?: string;
    Caixas?: number;
    Unidades?: number;
    Pallets?: number;
    transporte?: string;
    placa?: string;
    perfilVeiculo?: string;
    transportadora?: string;
    codCliente?: string;
    nomeCliente?: string;
    sequencia?: string | number;
    rota?: string;
    [key: string]: any;
  };
  type: 'transport' | 'customerCode';
  caminho?: string;
  index?: number;
};



export const Header: React.FC<HeaderProps> = ({ header, caminho, type, index }) => {
  const tipo = caminho?.split(' > ').find(item => item.includes('tipo:'))?.replace('tipo:', '')

  // Renderizar o header específico baseado no tipo
  if (tipo?.toUpperCase().includes('2-FIFO')) {
    return <FifoHeader header={header} caminho={caminho} type={type} index={index} />;
  }
  
  if (tipo?.toUpperCase().includes('0-PALLET')) {
    return <PalletFullHeader header={header} caminho={caminho} type={type} index={index} />;
  }
  
  if (tipo?.toUpperCase().includes('PICKING')) {
    return <PickingHeader header={header} caminho={caminho} type={type} index={index} />;
  }
  
  if (tipo?.toUpperCase().includes('3-UNIDADES')) {
    return <UnidadeHeader header={header} caminho={caminho} type={type} index={index} />;
  }

  // Se não corresponder a nenhum tipo específico, usar o header padrão (picking)
  return <PickingHeader header={header} caminho={caminho} type={type} index={index} />;
};

