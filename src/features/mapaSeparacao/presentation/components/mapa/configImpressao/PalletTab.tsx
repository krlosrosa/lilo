import { Dispatch, SetStateAction } from "react";
import { PalletConfig } from "../../config/pallet";
import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";

type PalletTabProps = {
  config: PropsConfig;
  setConfig: Dispatch<SetStateAction<PropsConfig>>;
};

export const PalletTab: React.FC<PalletTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Configuração de Pallet</h3>
        <p className="text-sm text-gray-600">Configure os parâmetros relacionados aos pallets</p>
      </div>
      
      <PalletConfig config={config} setConfig={setConfig} />
    </div>
  );
}; 