import { Dispatch, SetStateAction } from "react";
import { RangeConfig } from "../../config/range";
import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";

type RangeTabProps = {
  config: PropsConfig;
  setConfig: Dispatch<SetStateAction<PropsConfig>>;
};

export const RangeTab: React.FC<RangeTabProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-4">
      <div className="border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Range de Data</h3>
        <p className="text-sm text-gray-600">Configure o intervalo de datas para processamento</p>
      </div>
      
      <RangeConfig config={config} setConfig={setConfig} />
    </div>
  );
}; 