import { Dispatch, SetStateAction } from "react";
import { TipoConfig } from "../../config/tipo";
import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";

type TipoTabProps = {
  config: PropsConfig;
  setConfig: Dispatch<SetStateAction<PropsConfig>>;
};

export const TipoTab: React.FC<TipoTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Tipo de Configuração</h3>
        <p className="text-sm text-gray-600">Configure o tipo de processamento para o mapa de separação</p>
      </div>
      
      <TipoConfig config={config} setConfig={setConfig} />
    </div>
  );
}; 