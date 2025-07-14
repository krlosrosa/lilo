import React from "react";
import {
  Package,
  Truck,
  User,
  MapPin,
  Hash,
  Building2,
  Route,
  Layers,
  Box
} from "lucide-react";
import { formatNumberToBrazilian } from "../../../utils/fomartNumber";

type PalletFullHeaderProps = {
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
  allInfoClient: boolean;
  infoQrCode: string;
};

const summaryFields = [
  { key: "linhasPicking", label: "Linhas", icon: Hash },
  { key: "Caixas", label: "Caixas", icon: Package },
  { key: "Unidades", label: "Unidades", icon: Package },
  { key: "Pallets", label: "Pallets", icon: Layers },
];

export const PalletFullHeader: React.FC<PalletFullHeaderProps> = ({ header, caminho, type, index, allInfoClient, infoQrCode }) => {
  const empresa = caminho?.split(' > ').find(item => item.includes('empresa:'))?.replace('empresa:', '')
  const segmento = caminho?.split(' > ').find(item => item.includes('segmento:'))?.replace('segmento:', '')
  const tipo = caminho?.split(' > ').find(item => item.includes('tipo:'))?.replace('tipo:', '')
  const grupo = caminho?.split(' > ').find(item => item.includes('Group:'))?.replace('Group:', '')
  const transporte = caminho?.split(' > ').find(item => item.includes('transporte:'))?.replace('transporte:', '')

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded p-1.5 print:bg-white print:border-gray-400">
      <div className="flex justify-between items-center gap-1">
        {/* Informações principais */}
        <div className="flex flex-col gap-y-2 text-xs w-full">
          <div className="flex text-base items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-md border-l-4 border-green-500 px-4 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-green-700">
                <Layers className="w-5 h-5" />
                <span className="text-lg font-bold">PALLET FULL - {transporte?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-green-500" />
                <div className="flex items-center gap-2 text-gray-700">
                  <Package className="w-4 h-4" />
                  <span className="text-xl font-bold">{tipo?.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-gray-400 text-lg">•</span>
                  <span className="font-bold text-xl">{segmento?.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-gray-400 text-lg">•</span>
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{empresa?.toUpperCase()}</span>
              </div>
              <span className="text-gray-400 text-lg">•</span>

              {grupo && (
                <>
                  <span className="text-gray-400 text-lg">•</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Hash className="w-4 h-4" />
                    <span className="font-medium">Pallet: {grupo?.toUpperCase()}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex text-neutral-900 gap-4 font-semibold text-[10px]">
            <div className="flex items-center gap-1">
              <Layers size={12} />
              <p>Pallets Completos</p>
            </div>
            <div className="flex items-center gap-1">
              <Truck size={12} />
              <p>Placa: {header?.placa}</p>
            </div>
            <div className="flex items-center gap-1">
              <Building2 size={12} />
              <p>Transportadora: {header?.transportadora}</p>
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
            <div className="flex items-center gap-1">
              <Truck size={12} />
              <p>Perfil: {header?.perfilVeiculo}</p>
            </div>
          </div>

          <div className="flex text-neutral-900 text-[10px] gap-4 font-semibold">
            {(type === 'customerCode' || transporte?.toUpperCase().includes('SEGREGADO') || allInfoClient) && (
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
            <div className="flex items-center gap-1">
              <Hash size={12} />
              <p>Index: {index}</p>
            </div>
          </div>

          {/* Resumo de quantidades - Destaque especial para pallets */}
          <div className="flex items-center justify-center gap-8 bg-white rounded border px-2 py-1">
            {summaryFields.map(({ key, label, icon: Icon }) =>
              header[key] !== undefined && header[key] !== null ? (
                <div key={key} className="flex items-center gap-1 text-sm">
                  <Icon className={`w-2.5 h-2.5 ${key === 'Pallets' ? 'text-green-600' : 'text-gray-600'}`} />
                  <span className="text-gray-600">{label}:</span>
                  <span className={`font-bold ${key === 'Pallets' ? 'text-green-800 text-lg' : 'text-gray-800'}`}>
                    {formatNumberToBrazilian(header[key])}
                  </span>
                </div>
              ) : null
            )}
          </div>

          {/* Informação adicional específica para Pallet Full */}
          <div className="flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 rounded border border-green-200 px-3 py-2">
            <div className="flex items-center gap-2 text-green-700">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-semibold">PROCESSAMENTO DE PALLETS COMPLETOS</span>
            </div>
          </div>
        </div>

        {/* Sem QR Code para Pallet Full */}
      </div>
    </div>
  );
};
