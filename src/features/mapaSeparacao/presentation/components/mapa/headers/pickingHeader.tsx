import React from "react";
import {
  Package,
  Truck,
  User,
  MapPin,
  Hash,
  Building2,
  Route,
  QrCode
} from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

type PickingHeaderProps = {
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
    id?: string;
    [key: string]: any;

  };
  infoQrCode: string;
  type: 'transport' | 'customerCode';
  caminho?: string;
  index?: number;
};

const summaryFields = [
  { key: "linhasPicking", label: "Linhas", icon: Hash },
  { key: "Caixas", label: "Caixas", icon: Package },
  { key: "Unidades", label: "Unidades", icon: Package },
  { key: "Pallets", label: "Pallets", icon: Package },
  { key: "id", label: "ID", icon: Hash },
];

export const PickingHeader: React.FC<PickingHeaderProps> = ({ header, infoQrCode, caminho, type, index }) => {
  const empresa = caminho?.split(' > ').find(item => item.includes('empresa:'))?.replace('empresa:', '')
  const segmento = caminho?.split(' > ').find(item => item.includes('segmento:'))?.replace('segmento:', '')
  const tipo = caminho?.split(' > ').find(item => item.includes('tipo:'))?.replace('tipo:', '')
  const grupo = caminho?.split(' > ').find(item => item.includes('Group:'))?.replace('Group:', '')
  const transporte = caminho?.split(' > ').find(item => item.includes('transporte:'))?.replace('transporte:', '')

  return (
    <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-gray-200 rounded p-1.5 print:bg-white print:border-gray-400">
      <div className="flex justify-between items-center gap-1">
        {/* Informações principais */}
        <div className="flex flex-col gap-y-2 text-xs w-full">
          <div className="flex text-base items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 rounded-md border-l-4 border-blue-500 px-4 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-blue-700">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-bold">{transporte?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">•</span>
                <div className="flex items-center gap-2 text-gray-700">
                  <Package className="w-4 h-4" />
                  <span className=" font-bold">{tipo?.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="font-bold">{segmento?.toUpperCase()}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="flex text-neutral-900 gap-4 font-semibold text-[10px]">
            <div className="flex items-center gap-1">
              <Truck size={12} />
              <p>Placa: {header?.placa}</p>
            </div>
            <div className="flex items-center gap-1">
              <Hash size={12} />
              <p>Index: {index}</p>
            </div>
            <div className="flex items-center gap-1">
              <Building2 size={12} />
              <p>Transportadora: {header?.transportadora}</p>
            </div>
            <div className="flex items-center gap-1">
              <Truck size={12} />
              <p>Perfil: {header?.perfilVeiculo}</p>
            </div>
          </div>

          <div className="flex text-neutral-900 text-[10px] gap-4 font-semibold">
            <div className="flex items-center gap-1">
              <Route size={12} />
              <p>Rota: {header?.rota}</p>
            </div>
            <div className="flex items-center gap-1">
              <Hash size={12} />
              <p>Seq.: {header?.sequencia}</p>
            </div>
            {(type === 'customerCode' || transporte?.toUpperCase().includes('SEGREGADO')) && (
              <>
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <p>Cód. Cliente: {header?.codCliente}</p>
                </div>
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <p>Cliente: {header?.nomeCliente}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex text-neutral-900 text-[10px] gap-4 font-semibold">
            <div className="flex items-center gap-1">
              <Truck size={12} />
              <p>Transporte: {header?.transporte}</p>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <p>Local: {header?.local}</p>
            </div>
          </div>

          {/* Resumo de quantidades */}
          <div className="flex items-center justify-center gap-8 bg-white rounded border px-2 py-1">
            {summaryFields.map(({ key, label, icon: Icon }) =>
              header[key] !== undefined && header[key] !== null ? (
                <div key={key} className="flex items-center gap-1 text-sm">
                  <Icon className="w-2.5 h-2.5 text-green-600" />
                  <span className="text-gray-600">{label}:</span>
                  <span className="font-bold text-gray-800">{header[key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* QR Code com informações da empresa */}
        <div className="flex flex-col items-center bg-white rounded border p-2">
          {/* Informações da empresa */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 text-gray-700 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="font-medium text-sm">{empresa?.toUpperCase()}</span>
            </div>
            {grupo && (
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Hash className="w-3 h-3" />
                <span className="font-medium text-xs">Pallet: {grupo?.toUpperCase()}</span>
              </div>
            )}
          </div>
          
          {/* Separador visual */}
          <div className="border-t border-gray-200 w-full mb-2"></div>
          
          {/* QR Code */}
          <QRCodeSVG size={90} value={infoQrCode} />
        </div>
      </div>
    </div>
  );
};
