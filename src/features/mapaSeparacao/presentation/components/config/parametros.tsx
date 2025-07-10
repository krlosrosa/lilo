import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PropsConfig } from "../../../domain/generate-map";
import { Dispatch, SetStateAction } from "react";
import { produce } from "immer";
import { FileText, Layers, Package, Palette, RefreshCw, Clock, User } from "lucide-react";

type Props = {
  config: PropsConfig
  setConfig: Dispatch<SetStateAction<PropsConfig>>
}

export function ParametrosConfig({ config, setConfig }: Props) {

  const handleUpdateBooleanProperty = (property: keyof Pick<PropsConfig, 'isRange' | 'isPallet' | 'palletsFull' | 'unidadesSeparadas' | 'isSegregedFifo' | 'convertToPallet' | 'infoClientHeader'>, value: boolean) => {
    setConfig(produce(config, (draft) => {
      draft[property] = value;
    }));
  };

  const handleToggleRangeFifo = (color: string) => {
    setConfig(produce(config, (draft) => {
      if (draft.rangeFifo.includes(color)) {
        draft.rangeFifo = draft.rangeFifo.filter(c => c !== color);
      } else {
        draft.rangeFifo.push(color);
      }
    }));
  };

  const colorOptions = [
    { color: 'Vermelho', bgColor: 'bg-red-500/10', textColor: 'text-red-600 dark:text-red-400', icon: '🔴' },
    { color: 'Laranja', bgColor: 'bg-orange-500/10', textColor: 'text-orange-600 dark:text-orange-400', icon: '🟠' },
    { color: 'Amarelo', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-600 dark:text-yellow-400', icon: '🟡' }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Parâmetros Gerais</CardTitle>
            <CardDescription className="text-sm">Configure os parâmetros gerais do sistema</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Pallets Full */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Pallets Full em folhas separadas
          </Label>
          <RadioGroup 
            className="grid grid-cols-2 gap-2" 
            value={config.palletsFull ? 'Sim' : 'Não'} 
            onValueChange={(value) => handleUpdateBooleanProperty('palletsFull', value === 'Sim')}
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="Sim" id="sim-pallets" />
              <Label htmlFor="sim-pallets" className="cursor-pointer text-sm">Sim</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="Não" id="nao-pallets" />
              <Label htmlFor="nao-pallets" className="cursor-pointer text-sm">Não</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Unidades Separadas */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
            Unidades em folhas separadas
          </Label>
          <RadioGroup 
            className="grid grid-cols-2 gap-2" 
            value={config.unidadesSeparadas ? 'Sim' : 'Não'} 
            onValueChange={(value) => handleUpdateBooleanProperty('unidadesSeparadas', value === 'Sim')}
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="Sim" id="sim-unidades" />
              <Label htmlFor="sim-unidades" className="cursor-pointer text-sm">Sim</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="Não" id="nao-unidades" />
              <Label htmlFor="nao-unidades" className="cursor-pointer text-sm">Não</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Segregação FIFO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <Label className="text-base font-medium cursor-pointer">Segregação FIFO</Label>
            </div>
            <Switch 
              checked={config.isSegregedFifo} 
              onCheckedChange={(value) => handleUpdateBooleanProperty('isSegregedFifo', value)} 
            />
          </div>

          {config.isSegregedFifo && (
            <div className="space-y-3 ml-4 pl-3 border-l-2 border-primary/20">
              <div className="bg-muted/30 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Selecione as cores de prioridade para segregação FIFO baseada em data de validade.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Cores de Prioridade
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {colorOptions.map(({ color, bgColor, textColor, icon }) => (
                    <div key={color} className={`flex items-center space-x-3 p-2 rounded-lg ${bgColor} hover:bg-opacity-80 transition-colors`}>
                      <Checkbox
                        id={color.toLowerCase()}
                        checked={config.rangeFifo.includes(color)}
                        onCheckedChange={() => handleToggleRangeFifo(color)}
                      />
                      <span className="text-sm">{icon}</span>
                      <Label htmlFor={color.toLowerCase()} className={`cursor-pointer text-sm ${textColor}`}>
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Separator />

        {/* Informações do Cliente no Cabeçalho */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Exibir info do cliente no cabeçalho
          </Label>
          <RadioGroup
            className="grid grid-cols-2 gap-2"
            value={config.infoClientHeader ? 'Sim' : 'Não'}
            onValueChange={(value) => handleUpdateBooleanProperty('infoClientHeader', value === 'Sim')}
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="Sim" id="sim-info-cliente" />
              <Label htmlFor="sim-info-cliente" className="cursor-pointer text-sm">Sim</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="Não" id="nao-info-cliente" />
              <Label htmlFor="nao-info-cliente" className="cursor-pointer text-sm">Não</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Conversão de Caixas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <Label className="text-base font-medium cursor-pointer">Conversão de Caixas</Label>
            </div>
            <Switch 
              checked={config.convertToPallet} 
              onCheckedChange={(value) => handleUpdateBooleanProperty('convertToPallet', value)} 
            />
          </div>

          {config.convertToPallet && (
            <div className="ml-4 pl-3 border-l-2 border-primary/20">
              <div className="bg-muted/30 p-2 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Quando ativado, o sistema irá converter automaticamente caixas em pallets baseado nas regras definidas.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}