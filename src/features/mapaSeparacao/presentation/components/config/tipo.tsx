import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { PropsConfig } from "../../../domain/generate-map";
import { Dispatch, SetStateAction, useState } from "react";
import { produce } from "immer";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X, Settings, Users, Truck, UserCheck, ChevronDown, ChevronRight, Package } from "lucide-react";

type Props = {
  config: PropsConfig
  setConfig: Dispatch<SetStateAction<PropsConfig>>
}

export function TipoConfig({ config, setConfig }: Props) {

  // Ensure config exists and has all required properties
  const safeConfig = config || {
    tipo: 'transport',
    transportes: [],
    segregedClients: [],
    remessas: [],
    clientes: [],
    isRange: false,
    minRange: 0,
    maxRange: 100,
    isPallet: false,
    maxPallet: 0,
    palletsFull: false,
    unidadesSeparadas: false,
    isSegregedFifo: false,
    rangeFifo: [],
    convertToPallet: false,
    isLine: false,
    maxLine: 10,
  };

  // Estados para nomes de novos grupos e itens, por tipo de grupo
  const [newGroupNames, setNewGroupNames] = useState<{ [key: string]: string }>({});
  const [newItemNames, setNewItemNames] = useState<{ [key: string]: string }>({});

  const [newSegregedClient, setNewSegregedClient] = useState<string>('');
  const [isSegregationOpen, setIsSegregationOpen] = useState<boolean>(false);
  const [isGroupingOpen, setIsGroupingOpen] = useState<boolean>(false);
  const [isRemessasOpen, setIsRemessasOpen] = useState<boolean>(false);

  const toggleTipo = () => {
    setConfig((prev) =>
      produce(prev, (draft) => {
        draft.tipo = draft.tipo === 'transport' ? 'customerCode' : 'transport';
      })
    );
  };

  const handleAddSegregedClient = () => {
    setConfig(
      produce(config, (draft) => {
        if (!draft.segregedClients) draft.segregedClients = [];
        draft.segregedClients.push(newSegregedClient.trim());
      })
    )
    setNewSegregedClient('');
  }

  const handleRemoveSegregedClient = (clientIndex: number) => {
    setConfig(produce(config, (draft) => {
      if (!draft.segregedClients) draft.segregedClients = [];
      draft.segregedClients.splice(clientIndex, 1);
    }));
  };

  const handleAddItemToGroup = (config: PropsConfig, groupId: string, itemName: string, groupType: 'transportes' | 'clientes' | 'remessas') => {
    setConfig(produce(config, (draft) => {
      if (!draft[groupType]) draft[groupType] = [];
      const groups = draft[groupType];
      const group = groups.find(g => g.id === groupId);
      if (group) {
        group.items.push(itemName.trim());
      }
    }));
  };

  const handleUpdateGroupName = (groupId: string, newName: string, groupType: 'transportes' | 'clientes' | 'remessas') => {
    setConfig(produce(config, (draft) => {
      if (!draft[groupType]) draft[groupType] = [];
      const groups = draft[groupType];
      const group = groups.find(g => g.id === groupId);
      if (group) {
        group.name = newName;
      }
    }))
  };

  const handleRemoveItemFromGroup = (groupId: string, itemIndex: number, groupType: 'transportes' | 'clientes' | 'remessas') => {
    setConfig(produce(config, (draft) => {
      if (!draft[groupType]) draft[groupType] = [];
      const groups = draft[groupType];
      const group = groups.find(g => g.id === groupId);
      if (group) {
        group.items.splice(itemIndex, 1);
      }
    }));
  };

  const handleRemoveGroup = (groupId: string, groupType: 'transportes' | 'clientes' | 'remessas') => {
    setConfig(produce(config, (draft) => {
      if (!draft[groupType]) draft[groupType] = [];
      const groups = draft[groupType];
      const index = groups.findIndex(g => g.id === groupId);
      if (index !== -1) {
        groups.splice(index, 1);
      }
    }));
  }

  const handleAddGroup = (config: PropsConfig, groupName: string, groupType: 'transportes' | 'clientes' | 'remessas') => {
    setConfig(
      produce(config, (draft) => {
        if (!draft[groupType]) draft[groupType] = [];
        const groups = draft[groupType];
        groups.push({
          id: crypto.randomUUID(),
          name: groupName.trim(),
          items: []
        });
      })
    )
  };

  const handleLocalNewGroupNameChange = (groupType: string, value: string) => {
    setNewGroupNames((prev) => ({ ...prev, [groupType]: value }));
  };
  const handleLocalNewItemNameChange = (groupType: string, value: string) => {
    setNewItemNames((prev) => ({ ...prev, [groupType]: value }));
  };
  const getLocalNewGroupName = (groupType: string) => newGroupNames[groupType] || "";
  const getLocalNewItemName = (groupType: string) => newItemNames[groupType] || "";
  const clearLocalNewGroupName = (groupType: string) => {
    setNewGroupNames((prev) => ({ ...prev, [groupType]: "" }));
  };
  const clearLocalNewItemName = (groupType: string) => {
    setNewItemNames((prev) => ({ ...prev, [groupType]: "" }));
  };

  const renderGroupManagement = (
    groupType: 'transportes' | 'clientes' | 'remessas',
    title: string,
    icon: React.ReactNode,
    color: string,
    placeholder: string,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
  ) => {
    const groups = safeConfig[groupType] || [];
    const localNewGroupName = getLocalNewGroupName(groupType);
    const localNewItemName = getLocalNewItemName(groupType);

    return (
      <div className="space-y-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <Label className="text-base font-medium cursor-pointer">{title}</Label>
            <span className="text-xs text-muted-foreground">
              ({groups.length} grupo{groups.length !== 1 ? 's' : ''})
            </span>
          </div>
          {isOpen ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          }
        </button>

        {isOpen && (
          <div className="space-y-3 ml-4 pl-3 border-l-2 border-primary/20">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nome do grupo"
                value={localNewGroupName}
                onChange={(e) => handleLocalNewGroupNameChange(groupType, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && localNewGroupName.trim() && handleAddGroup(config, localNewGroupName, groupType)}
                className="flex-1"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => { handleAddGroup(config, localNewGroupName, groupType); clearLocalNewGroupName(groupType); }} 
                disabled={!localNewGroupName.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {groups.map((group) => (
                <Card key={group.id} className="bg-muted/30 border-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={group.name}
                        onChange={(e) => handleUpdateGroupName(group.id, e.target.value, groupType)}
                        className="flex-1 bg-background h-8"
                        placeholder="Nome do grupo"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveGroup(group.id, groupType)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={placeholder}
                          value={localNewItemName}
                          onChange={(e) => handleLocalNewItemNameChange(groupType, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && localNewItemName.trim() && handleAddItemToGroup(config, group.id, localNewItemName, groupType)}
                          className="flex-1 bg-background h-8"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { handleAddItemToGroup(config, group.id, localNewItemName, groupType); clearLocalNewItemName(groupType); }}
                          disabled={!localNewItemName.trim()}
                          className="h-8 px-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {group.items.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {group.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-background p-1.5 rounded border">
                              <span className="text-xs truncate">{item}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveItemFromGroup(group.id, index, groupType)}
                                className="h-5 w-5 text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Configuração de Tipo</CardTitle>
            <CardDescription className="text-sm">Defina o tipo de configuração para o mapa</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Configuração */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Tipo de Configuração
          </Label>
          <RadioGroup 
            className="grid grid-cols-2 gap-3" 
            value={safeConfig.tipo} 
            onValueChange={toggleTipo}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="transport" id="transporte" />
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <Label htmlFor="transporte" className="cursor-pointer text-sm">Transporte</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="customerCode" id="cliente" />
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              <Label htmlFor="cliente" className="cursor-pointer text-sm">Cliente</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Configurações específicas para Transporte */}
        {safeConfig.tipo === 'transport' && (
          <>
            <Separator />
            
            {/* Segregação de Clientes - Colapsável */}
            <div className="space-y-3">
              <button
                onClick={() => setIsSegregationOpen(!isSegregationOpen)}
                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <Label className="text-base font-medium cursor-pointer">Segregação de Clientes</Label>
                  <span className="text-xs text-muted-foreground">
                    ({(safeConfig.segregedClients || []).length} cliente{(safeConfig.segregedClients || []).length !== 1 ? 's' : ''})
                  </span>
                </div>
                {isSegregationOpen ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </button>
              
              {isSegregationOpen && (
                <div className="space-y-3 ml-4 pl-3 border-l-2 border-primary/20">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Digite o nome do cliente"
                      value={newSegregedClient}
                      onChange={(e) => setNewSegregedClient(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && newSegregedClient.trim() && handleAddSegregedClient()}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleAddSegregedClient} 
                      disabled={!newSegregedClient.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {safeConfig.segregedClients.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {safeConfig.segregedClients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                          <span className="text-sm truncate">{client}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveSegregedClient(index)}
                            className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Agrupamento de Transporte */}
            {renderGroupManagement(
              'transportes',
              'Agrupamento de Transporte',
              <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />,
              'text-green-600',
              'Adicionar item',
              isGroupingOpen,
              setIsGroupingOpen
            )}

            {/* Agrupamento de Remessas */}
            {renderGroupManagement(
              'remessas',
              'Agrupamento de Remessas',
              <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
              'text-purple-600',
              'Adicionar remessa',
              isRemessasOpen,
              setIsRemessasOpen
            )}
          </>
        )}

        {/* Configurações específicas para Cliente */}
        {safeConfig.tipo === 'customerCode' && (
          <>
            <Separator />
            
            {renderGroupManagement(
              'clientes',
              'Agrupamento de Clientes',
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
              'text-purple-600',
              'Adicionar cliente',
              isGroupingOpen,
              setIsGroupingOpen
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}