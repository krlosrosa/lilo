"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  User, 
  Plus, 
  Trash2, 
  Search, 
  Filter,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  MapPin,
  ArrowUp,
  ArrowDown,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Demanda {
  id: string;
  produto: string;
  lote: string;
  quantidade: number;
  operador?: string;
  tipoMovimentacao: "ressuprimento" | "separacao";
  destino?: string;
  status: "pendente" | "em_andamento" | "concluida";
  dataCriacao: string;
  prioridade: "baixa" | "media" | "alta";
}

export default function Movimentacao() {
  const [demandas, setDemandas] = useState<Demanda[]>([
    {
      id: "1",
      produto: "PROD001 - Produto A",
      lote: "LOT2024001",
      quantidade: 50,
      operador: "João Silva",
      tipoMovimentacao: "ressuprimento",
      status: "em_andamento",
      dataCriacao: "2024-01-15 14:30",
      prioridade: "alta"
    },
    {
      id: "2",
      produto: "PROD002 - Produto B",
      lote: "LOT2024002",
      quantidade: 25,
      tipoMovimentacao: "separacao",
      destino: "Setor A - Prateleira 3",
      status: "pendente",
      dataCriacao: "2024-01-15 15:00",
      prioridade: "media"
    },
    {
      id: "3",
      produto: "PROD003 - Produto C",
      lote: "LOT2024003",
      quantidade: 100,
      operador: "Maria Santos",
      tipoMovimentacao: "separacao",
      destino: "Setor B - Prateleira 1",
      status: "concluida",
      dataCriacao: "2024-01-15 13:15",
      prioridade: "baixa"
    }
  ]);

  const [formData, setFormData] = useState({
    produto: "",
    lote: "",
    quantidade: "",
    operador: "",
    tipoMovimentacao: "ressuprimento" as "ressuprimento" | "separacao",
    destino: "",
    prioridade: "media" as "baixa" | "media" | "alta"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.produto || !formData.lote || !formData.quantidade) {
      return;
    }

    const novaDemanda: Demanda = {
      id: Date.now().toString(),
      produto: formData.produto,
      lote: formData.lote,
      quantidade: parseInt(formData.quantidade),
      operador: formData.operador || undefined,
      tipoMovimentacao: formData.tipoMovimentacao,
      destino: formData.destino || undefined,
      status: "pendente",
      dataCriacao: new Date().toLocaleString('pt-BR'),
      prioridade: formData.prioridade
    };

    setDemandas(prev => [novaDemanda, ...prev]);
    setFormData({
      produto: "",
      lote: "",
      quantidade: "",
      operador: "",
      tipoMovimentacao: "ressuprimento",
      destino: "",
      prioridade: "media"
    });
  };

  const handlePrioridadeChange = (demandaId: string, novaPrioridade: "baixa" | "media" | "alta") => {
    setDemandas(prev => prev.map(demanda => 
      demanda.id === demandaId 
        ? { ...demanda, prioridade: novaPrioridade }
        : demanda
    ));
  };

  const handleMoveUp = (demandaId: string) => {
    setDemandas(prev => {
      const index = prev.findIndex(d => d.id === demandaId);
      if (index <= 0) return prev;
      
      const newDemandas = [...prev];
      [newDemandas[index], newDemandas[index - 1]] = [newDemandas[index - 1], newDemandas[index]];
      return newDemandas;
    });
  };

  const handleMoveDown = (demandaId: string) => {
    setDemandas(prev => {
      const index = prev.findIndex(d => d.id === demandaId);
      if (index === -1 || index >= prev.length - 1) return prev;
      
      const newDemandas = [...prev];
      [newDemandas[index], newDemandas[index + 1]] = [newDemandas[index + 1], newDemandas[index]];
      return newDemandas;
    });
  };

  const getStatusColor = (status: Demanda["status"]) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "em_andamento":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "concluida":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: Demanda["status"]) => {
    switch (status) {
      case "pendente":
        return <AlertCircle className="w-4 h-4" />;
      case "em_andamento":
        return <Clock className="w-4 h-4" />;
      case "concluida":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPrioridadeColor = (prioridade: Demanda["prioridade"]) => {
    switch (prioridade) {
      case "baixa":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "media":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "alta":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentação de Pallet</h1>
          <p className="text-muted-foreground mt-1">
            Gestão manual de demandas para operadores de empilhadeira
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="nova" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nova" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Demanda
          </TabsTrigger>
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Lista de Demandas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Nova Demanda de Movimentação</CardTitle>
                  <CardDescription>
                    Preencha os dados para criar uma nova demanda de movimentação
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto *</Label>
                  <Input
                    id="produto"
                    placeholder="Digite o código e descrição do produto"
                    value={formData.produto}
                    onChange={(e) => handleInputChange("produto", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lote">Lote *</Label>
                  <Input
                    id="lote"
                    placeholder="Digite o número do lote"
                    value={formData.lote}
                    onChange={(e) => handleInputChange("lote", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Digite a quantidade"
                    value={formData.quantidade}
                    onChange={(e) => handleInputChange("quantidade", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operador">Operador (Opcional)</Label>
                  <Input
                    id="operador"
                    placeholder="Digite o nome do operador"
                    value={formData.operador}
                    onChange={(e) => handleInputChange("operador", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tipoMovimentacao">Tipo de Movimentação *</Label>
                  <div className="flex gap-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="ressuprimento"
                        name="tipoMovimentacao"
                        value="ressuprimento"
                        checked={formData.tipoMovimentacao === "ressuprimento"}
                        onChange={(e) => handleInputChange("tipoMovimentacao", e.target.value)}
                        className="text-primary"
                      />
                      <label htmlFor="ressuprimento" className="text-sm font-medium flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4" />
                        Ressuprimento
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="separacao"
                        name="tipoMovimentacao"
                        value="separacao"
                        checked={formData.tipoMovimentacao === "separacao"}
                        onChange={(e) => handleInputChange("tipoMovimentacao", e.target.value)}
                        className="text-primary"
                      />
                      <label htmlFor="separacao" className="text-sm font-medium flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Separação
                      </label>
                    </div>
                  </div>
                </div>
                
                {formData.tipoMovimentacao === "separacao" && (
                  <div className="space-y-2">
                    <Label htmlFor="destino">Destino *</Label>
                    <Input
                      id="destino"
                      placeholder="Digite o destino da separação"
                      value={formData.destino}
                      onChange={(e) => handleInputChange("destino", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="flex gap-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="baixa"
                      name="prioridade"
                      value="baixa"
                      checked={formData.prioridade === "baixa"}
                      onChange={(e) => handleInputChange("prioridade", e.target.value)}
                      className="text-primary"
                    />
                    <label htmlFor="baixa" className="text-sm font-medium">
                      Baixa
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="media"
                      name="prioridade"
                      value="media"
                      checked={formData.prioridade === "media"}
                      onChange={(e) => handleInputChange("prioridade", e.target.value)}
                      className="text-primary"
                    />
                    <label htmlFor="media" className="text-sm font-medium">
                      Média
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="alta"
                      name="prioridade"
                      value="alta"
                      checked={formData.prioridade === "alta"}
                      onChange={(e) => handleInputChange("prioridade", e.target.value)}
                      className="text-primary"
                    />
                    <label htmlFor="alta" className="text-sm font-medium">
                      Alta
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.produto || !formData.lote || !formData.quantidade || 
                           (formData.tipoMovimentacao === "separacao" && !formData.destino)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Demanda
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Lista de Demandas</CardTitle>
                  <CardDescription>
                    Visualize e gerencie todas as demandas de movimentação
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandas.map((demanda) => (
                  <div
                    key={demanda.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    {/* Informações principais */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getStatusColor(demanda.status))}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(demanda.status)}
                            {demanda.status === "pendente" && "Pendente"}
                            {demanda.status === "em_andamento" && "Em Andamento"}
                            {demanda.status === "concluida" && "Concluída"}
                          </div>
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPrioridadeColor(demanda.prioridade))}
                        >
                          {demanda.prioridade === "baixa" && "Baixa"}
                          {demanda.prioridade === "media" && "Média"}
                          {demanda.prioridade === "alta" && "Alta"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-medium text-foreground">{demanda.produto}</h3>
                        <p className="text-sm text-muted-foreground">
                          Lote: {demanda.lote} • Qtd: {demanda.quantidade} unidades
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {demanda.tipoMovimentacao === "ressuprimento" ? (
                            <div className="flex items-center gap-1">
                              <ArrowUpDown className="w-4 h-4" />
                              <span>Ressuprimento</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              <span>Separação</span>
                            </div>
                          )}
                        </div>
                        {demanda.tipoMovimentacao === "separacao" && demanda.destino && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>Destino: {demanda.destino}</span>
                          </div>
                        )}
                        {demanda.operador && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>Operador: {demanda.operador}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Data e ações */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {demanda.dataCriacao}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Controles de prioridade */}
                        {demanda.status === "pendente" && (
                          <>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePrioridadeChange(demanda.id, "baixa")}
                                className={cn(
                                  "h-7 px-2 text-xs",
                                  demanda.prioridade === "baixa" 
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800" 
                                    : "text-muted-foreground"
                                )}
                              >
                                Baixa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePrioridadeChange(demanda.id, "media")}
                                className={cn(
                                  "h-7 px-2 text-xs",
                                  demanda.prioridade === "media" 
                                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" 
                                    : "text-muted-foreground"
                                )}
                              >
                                Média
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePrioridadeChange(demanda.id, "alta")}
                                className={cn(
                                  "h-7 px-2 text-xs",
                                  demanda.prioridade === "alta" 
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" 
                                    : "text-muted-foreground"
                                )}
                              >
                                Alta
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveUp(demanda.id)}
                                className="h-6 w-6 p-0"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveDown(demanda.id)}
                                className="h-6 w-6 p-0"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </Button>
                            </div>
                          </>
                        )}
                        
                        {/* Ações de edição/exclusão */}
                        {demanda.status === "pendente" && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}