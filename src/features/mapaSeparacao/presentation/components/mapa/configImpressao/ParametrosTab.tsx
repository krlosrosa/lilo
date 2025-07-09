import { Dispatch, SetStateAction } from "react";
import { ParametrosConfig } from "../../config/parametros";
import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";

type ParametrosTabProps = {
  config: PropsConfig;
  setConfig: Dispatch<SetStateAction<PropsConfig>>;
};

export const ParametrosTab: React.FC<ParametrosTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Parâmetros</h3>
        <p className="text-sm text-gray-600">Configure os parâmetros adicionais do sistema</p>
      </div>
      
      <ParametrosConfig config={config} setConfig={setConfig} />
    </div>
  );
}; 