import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PropsConfig } from "../../../domain/generate-map";
import { Dispatch, SetStateAction } from "react";
import { produce } from "immer";
import { Package, Layers, BarChart3 } from "lucide-react";

type Props = {
  config: PropsConfig
  setConfig: Dispatch<SetStateAction<PropsConfig>>
}

export function PalletConfig({ config, setConfig }: Props) {

  const handleUpdateBooleanProperty = (property: keyof Pick<PropsConfig, 'isRange' | 'isPallet' | 'palletsFull' | 'unidadesSeparadas' | 'isSegregedFifo' | 'convertToPallet' | 'isLine'>, value: boolean) => {
    setConfig(
      produce(config, (draft) => {
        draft[property] = value;
      })
    );
  };

  const handleUpdateNumberProperty = (property: keyof Pick<PropsConfig, 'minRange' | 'maxRange' | 'maxPallet' | 'maxLine'>, value: string) => {
    setConfig(produce(config, (draft) => {
      draft[property] = Number(value);
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Configuração de Pallet</CardTitle>
            <CardDescription>Configure as opções de quebra de pallet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Quebra de Pallet por Altura */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-medium">Quebra de Pallet por Altura Padrão</Label>
                <p className="text-sm text-muted-foreground mt-1">Ativa a quebra automática de pallets baseada no percentual</p>
              </div>
            </div>
            <Switch 
              checked={config.isPallet} 
              onCheckedChange={(value) => handleUpdateBooleanProperty('isPallet', value)} 
              aria-label="Ativar quebra de pallet por altura padrão" 
            />
          </div>

          {config.isPallet && (
            <div className="ml-4 pl-4 border-l-2 border-primary/20">
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Quando ativado, o mapa exibirá o range de datas calculado baseado no percentual definido abaixo.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPallet" className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Percentual Máximo
                  </Label>
                  <Input
                    id="maxPallet"
                    type="number"
                    placeholder="Digite o percentual (ex: 80)"
                    value={config.maxPallet ?? ""}
                    onChange={(e) => handleUpdateNumberProperty('maxPallet', e.target.value)}
                    aria-label="Percentual máximo de pallet"
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quebra de Pallet por Linha */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Layers className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <Label className="text-base font-medium">Quebra de Pallet por Linha</Label>
                <p className="text-sm text-muted-foreground mt-1">Ativa a quebra de pallet baseada no número de linhas</p>
              </div>
            </div>
            <Switch 
              checked={config.isLine} 
              onCheckedChange={(value) => handleUpdateBooleanProperty('isLine', value)} 
              aria-label="Ativar quebra de pallet por linha" 
            />
          </div>

          {config.isLine && (
            <div className="ml-4 pl-4 border-l-2 border-primary/20">
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Define o número máximo de linhas por pallet antes da quebra.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLine" className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Máximo de Linhas
                  </Label>
                  <Input
                    id="maxLine"
                    type="number"
                    placeholder="Digite o número de linhas (ex: 10)"
                    value={config.maxLine ?? ""}
                    onChange={(e) => handleUpdateNumberProperty('maxLine', e.target.value)}
                    aria-label="Número máximo de linhas por pallet"
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}