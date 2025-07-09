import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PropsConfig } from "../../../domain/generate-map";
import { Dispatch, SetStateAction } from "react";
import { produce } from "immer";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  config: PropsConfig
  setConfig: Dispatch<SetStateAction<PropsConfig>>
}

export function RangeConfig({ config, setConfig }: Props) {

  const handleUpdateNumberProperty = (property: keyof Pick<PropsConfig, 'minRange' | 'maxRange' | 'maxPallet'>, value: string) => {
    setConfig(produce(config, (draft) => {
      draft[property] = Number(value);
    }));
  };

  const handleUpdateBooleanProperty = (property: keyof Pick<PropsConfig, 'isRange' | 'isPallet' | 'palletsFull' | 'unidadesSeparadas' | 'isSegregedFifo' | 'convertToPallet'>, value: boolean) => {
    setConfig(produce(config, (draft) => {
      draft[property] = value;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Configuração de Range</CardTitle>
            <CardDescription>Configure as opções de exibição de range no mapa</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Switch Principal */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <Label className="text-base font-medium">Exibir Range no Mapa</Label>
              <p className="text-sm text-muted-foreground mt-1">Exibe as ranges no mapa de separação</p>
            </div>
          </div>
          <Switch 
            checked={config.isRange} 
            onCheckedChange={(value) => handleUpdateBooleanProperty('isRange', value)} 
          />
        </div>

        {/* Configurações do Range */}
        {config.isRange && (
          <div className="ml-4 pl-4 border-l-2 border-primary/20 space-y-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Quando ativado, o mapa exibirá o range de datas calculado baseado nos percentuais definidos abaixo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Percentual Mínimo */}
              <div className="space-y-3">
                <Label htmlFor="minRange" className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Percentual Mínimo
                </Label>
                <div className="relative">
                  <Input
                    id="minRange"
                    type="number"
                    placeholder="0"
                    value={config.minRange}
                    onChange={(e) => handleUpdateNumberProperty('minRange', e.target.value)}
                    className="pr-8"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              {/* Percentual Máximo */}
              <div className="space-y-3">
                <Label htmlFor="maxRange" className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Percentual Máximo
                </Label>
                <div className="relative">
                  <Input
                    id="maxRange"
                    type="number"
                    placeholder="100"
                    value={config.maxRange}
                    onChange={(e) => handleUpdateNumberProperty('maxRange', e.target.value)}
                    className="pr-8"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}