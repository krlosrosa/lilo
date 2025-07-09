import { Dispatch, SetStateAction, useState } from "react";
import { TipoTab, RangeTab, PalletTab, ParametrosTab, ColunasTab } from "./mapa/configImpressao";
import { PropsConfig } from "../../domain/generate-map";
import { Settings, Calendar, Package, FileText, Table } from "lucide-react";

type Props = {
  config: PropsConfig;
  setConfig: Dispatch<SetStateAction<PropsConfig>>
}

export default function Configuracao({ config, setConfig }: Props) {
  const [activeConfigTab, setActiveConfigTab] = useState<string>('tipo');

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Tabs Verticais */}
        <div className="w-64 space-y-2">
          <div 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              activeConfigTab === "tipo" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setActiveConfigTab("tipo")}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Tipo de Configuração</span>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              activeConfigTab === "range" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setActiveConfigTab("range")}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Range de Data</span>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              activeConfigTab === "pallet" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setActiveConfigTab("pallet")}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Configuração de Pallet</span>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              activeConfigTab === "parametros" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setActiveConfigTab("parametros")}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Parâmetros</span>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              activeConfigTab === "colunas" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setActiveConfigTab("colunas")}
          >
            <div className="flex items-center gap-3">
              <Table className="w-4 h-4" />
              <span className="text-sm font-medium">Colunas das Tabelas</span>
            </div>
          </div>
        </div>

        {/* Conteúdo dos Tabs */}
        <div className="flex-1">
          {activeConfigTab === "tipo" && (
            <TipoTab config={config} setConfig={setConfig} />
          )}
          
          {activeConfigTab === "range" && (
            <RangeTab config={config} setConfig={setConfig} />
          )}
          
          {activeConfigTab === "pallet" && (
            <PalletTab config={config} setConfig={setConfig} />
          )}
          
          {activeConfigTab === "parametros" && (
            <ParametrosTab config={config} setConfig={setConfig} />
          )}
          
          {activeConfigTab === "colunas" && (
            <ColunasTab config={config} setConfig={setConfig} />
          )}
        </div>
      </div>
    </div>
  );
}