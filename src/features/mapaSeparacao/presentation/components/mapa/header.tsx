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
    linhasPicking?: number;
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
  const segmento = caminho?.split(' > ').find(item => item.includes('segmento:'))?.replace('segmento:', '')
  const empresa = caminho?.split(' > ').find(item => item.includes('empresa:'))?.replace('empresa:', '')
  const infoQrCode = `${header.transporte};${header.id};${header.Caixas};${header.Unidades};${header.linhasPicking};${segmento};${empresa};SEPARACAO`

  // Renderizar o header específico baseado no tipo
  if (tipo?.toUpperCase().includes('2-FIFO')) {
    return <FifoHeader infoQrCode={infoQrCode}  header={header} caminho={caminho} type={type} index={index} />;
  }
  
  if (tipo?.toUpperCase().includes('0-PALLET')) {
    return <PalletFullHeader header={header} caminho={caminho} type={type} index={index} />;
  }
  
  if (tipo?.toUpperCase().includes('PICKING')) {
    return <PickingHeader infoQrCode={infoQrCode} header={header} caminho={caminho} type={type} index={index} />;
  }
  
  if (tipo?.toUpperCase().includes('3-UNIDADES')) {
    return <UnidadeHeader infoQrCode={infoQrCode} header={header} caminho={caminho} type={type} index={index} />;
  }

  // Se não corresponder a nenhum tipo específico, usar o header padrão (picking)
  return <PickingHeader infoQrCode={infoQrCode} header={header} caminho={caminho} type={type} index={index} />;
};

