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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ClipboardList, 
  User, 
  Plus, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  MapPin,
  Package,
  Target,
  BarChart3,
  FileText,
  Building,
  Grid3X3
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Inventario() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showOperadorModal, setShowOperadorModal] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState<string | null>(null);
  const [selectedTipoInventario, setSelectedTipoInventario] = useState("");
  const [selectedOperador, setSelectedOperador] = useState("");
  const [selectedEndereco, setSelectedEndereco] = useState("");
  const [selectedGalpao, setSelectedGalpao] = useState("");
  const [selectedRua, setSelectedRua] = useState("");
  const [selectedEnderecoNum, setSelectedEnderecoNum] = useState("");
  const [selectedNivel, setSelectedNivel] = useState("");
  const [enderecoDigitado, setEnderecoDigitado] = useState("");
  const [modoEndereco, setModoEndereco] = useState<"manual" | "seletor">("manual");
  
  // Funções para lidar com demandas
  const handleCriarDemanda = (inventarioId: string, tipoInventario: string) => {
    setSelectedInventario(inventarioId);
    setSelectedTipoInventario(tipoInventario);
    setShowOperadorModal(true);
  };

  const handleConfirmarOperador = () => {
    const enderecoFinal = modoEndereco === "manual" ? enderecoDigitado : `${selectedGalpao} ${selectedRua} ${selectedEnderecoNum} ${selectedNivel}`;
    
    if (selectedOperador && enderecoFinal) {
      // Aqui você implementaria a lógica para salvar a demanda
      setShowOperadorModal(false);
      setSelectedOperador("");
      setSelectedEndereco("");
      setSelectedGalpao("");
      setSelectedRua("");
      setSelectedEnderecoNum("");
      setSelectedNivel("");
      setEnderecoDigitado("");
      setModoEndereco("manual");
      setSelectedInventario(null);
      setSelectedTipoInventario("");
    }
  };

  const handleCancelarOperador = () => {
    setShowOperadorModal(false);
    setSelectedOperador("");
    setSelectedEndereco("");
    setSelectedGalpao("");
    setSelectedRua("");
    setSelectedEnderecoNum("");
    setSelectedNivel("");
    setEnderecoDigitado("");
    setModoEndereco("manual");
    setSelectedInventario(null);
    setSelectedTipoInventario("");
  };
  
  // Dados de operadores
  const operadores = [
    { id: 1, nome: "João Silva", setor: "Logística", status: "disponível" },
    { id: 2, nome: "Maria Santos", setor: "Logística", status: "disponível" },
    { id: 3, nome: "Pedro Costa", setor: "Logística", status: "ocupado" },
    { id: 4, nome: "Ana Oliveira", setor: "Logística", status: "disponível" },
    { id: 5, nome: "Carlos Lima", setor: "Logística", status: "disponível" }
  ];

  // Sistema hierárquico de endereços baseado no padrão A 001 0001 10
  const enderecosHierarquicos = {
    galpoes: ["A", "B", "C", "D", "E", "F"],
    ruas: ["001", "002", "003", "004", "005"],
    enderecos: ["0001", "0002", "0003", "0004", "0005", "0006", "0007", "0008", "0009", "0010"],
    niveis: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
  };

  // Endereços pré-definidos para seleção rápida
  const enderecosRapidos = [
    "A 001 0001 01", "A 001 0001 02", "A 001 0001 03", "A 001 0001 04", "A 001 0001 05",
    "A 001 0002 01", "A 001 0002 02", "A 001 0002 03", "A 001 0002 04", "A 001 0002 05",
    "A 002 0001 01", "A 002 0001 02", "A 002 0001 03", "A 002 0001 04", "A 002 0001 05",
    "B 001 0001 01", "B 001 0001 02", "B 001 0001 03", "B 001 0001 04", "B 001 0001 05",
    "B 002 0001 01", "B 002 0001 02", "B 002 0001 03", "B 002 0001 04", "B 002 0001 05",
    "C 001 0001 01", "C 001 0001 02", "C 001 0001 03", "C 001 0001 04", "C 001 0001 05"
  ];

  // MOCK: Lista de inventários
  const inventarios = [
    {
      id: "inv-1",
      nome: "Inventário Geral - Janeiro 2024",
      tipo: "produtos",
      status: "Em Andamento",
      badgeStatus: "bg-green-500/10 text-green-600 dark:text-green-400",
      badgeTipo: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      periodo: "15/01/2024 - 31/01/2024",
      operadores: 3,
      progresso: "65% concluído"
    },
    {
      id: "inv-2",
      nome: "Inventário Cíclico - Setor A",
      tipo: "materiais",
      status: "Pendente",
      badgeStatus: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      badgeTipo: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      periodo: "01/02/2024 - 15/02/2024",
      operadores: 1,
      progresso: null
    },
    {
      id: "inv-3",
      nome: "Inventário por Categoria - Eletrônicos",
      tipo: "equipamentos",
      status: "Concluído",
      badgeStatus: "bg-green-500/10 text-green-600 dark:text-green-400",
      badgeTipo: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      periodo: "01/01/2024 - 10/01/2024",
      operadores: 2,
      progresso: "100% concluído"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Inventário</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e controle de inventários e demandas de contagem
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="inventarios" className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Inventários
          </TabsTrigger>
          <TabsTrigger value="demandas" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Demandas
          </TabsTrigger>
          <TabsTrigger value="cadastro" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Inventário
          </TabsTrigger>
        </TabsList>

        {/* Tab: Overview */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Cards de Estatísticas */}
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Inventários</CardTitle>
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    42% do total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Demandas Ativas</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    +8 esta semana
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Operadores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    6 disponíveis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Inventários Recentes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <ClipboardList className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle>Inventários Recentes</CardTitle>
                        <CardDescription>
                          Últimos inventários criados
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab("cadastro")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Inventário
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventarios.slice(0, 3).map((inventario) => (
                      <div key={inventario.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{inventario.nome}</h4>
                          <p className="text-xs text-muted-foreground">{inventario.periodo}</p>
                        </div>
                        <Badge variant="outline" className={inventario.badgeStatus}>
                          {inventario.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Demanda
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demandas Prioritárias */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Demandas Prioritárias</CardTitle>
                      <CardDescription>
                        Demandas que precisam de atenção
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors border-orange-200 bg-orange-50/30">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Contagem - Prateleiras 1-5</h4>
                        <p className="text-xs text-muted-foreground">João Silva • 40% concluído</p>
                      </div>
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400">
                        Alta
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Contagem - Prateleiras 6-10</h4>
                        <p className="text-xs text-muted-foreground">Maria Santos • Pendente</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                        Média
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">Contagem - Setor B</h4>
                        <p className="text-xs text-muted-foreground">Pedro Costa • 100% concluído</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                        Concluída
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab("cadastro")}
                    >
                      <Plus className="w-6 h-6" />
                      <span>Novo Inventário</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Target className="w-6 h-6" />
                      <span>Nova Demanda</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Users className="w-6 h-6" />
                      <span>Gerenciar Operadores</span>
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <FileText className="w-6 h-6" />
                      <span>Relatórios</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Novo Inventário */}
        <TabsContent value="cadastro" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Cadastro */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Novo Inventário</CardTitle>
                      <CardDescription>
                        Configure os parâmetros do inventário
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Inventário *</Label>
                      <Input
                        id="nome"
                        placeholder="Ex: Inventário Geral - Janeiro 2024"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de Inventário *</Label>
                      <select className="w-full p-2 border rounded-md bg-background text-foreground">
                        <option value="">Selecione o tipo</option>
                        <option value="geral">Inventário Geral</option>
                        <option value="ciclico">Inventário Cíclico</option>
                        <option value="categoria">Por Categoria</option>
                        <option value="localizacao">Por Localização</option>
                        <option value="amostra">Por Amostra</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataInicio">Data de Início *</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dataFim">Data de Fim *</Label>
                      <Input
                        id="dataFim"
                        type="date"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        placeholder="Ex: Setor A, Prateleira 1-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="responsavel">Responsável Geral</Label>
                      <Input
                        id="responsavel"
                        placeholder="Nome do supervisor"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <div className="flex gap-3">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="baixa" name="prioridade" value="baixa" className="text-primary" />
                        <label htmlFor="baixa" className="text-sm font-medium">Baixa</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="media" name="prioridade" value="media" className="text-primary" defaultChecked />
                        <label htmlFor="media" className="text-sm font-medium">Média</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="alta" name="prioridade" value="alta" className="text-primary" />
                        <label htmlFor="alta" className="text-sm font-medium">Alta</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <textarea
                      id="observacoes"
                      className="w-full p-2 border rounded-md bg-background text-foreground min-h-[80px] resize-none"
                      placeholder="Observações sobre o inventário..."
                    />
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      Cancelar
                    </Button>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Inventário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview/Resumo */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline">Pendente</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progresso:</span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Demandas:</span>
                    <span className="text-sm font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Operadores:</span>
                    <span className="text-sm font-medium">0</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>1. Criar inventário</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>2. Adicionar demandas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>3. Alocar operadores</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>4. Iniciar contagem</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Inventários */}
        <TabsContent value="inventarios" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ClipboardList className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Inventários</CardTitle>
                  <CardDescription>
                    Visualize e gerencie todos os inventários
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventarios.map((inventario) => (
                  <div key={inventario.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground">{inventario.nome}</h3>
                        <Badge variant="outline" className={inventario.badgeStatus}>{inventario.status}</Badge>
                        <Badge variant="outline" className={inventario.badgeTipo}>{inventario.tipo.charAt(0).toUpperCase() + inventario.tipo.slice(1)}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{inventario.periodo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{inventario.operadores} operador{inventario.operadores > 1 ? 'es' : ''}</span>
                        </div>
                        {inventario.progresso && (
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{inventario.progresso}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCriarDemanda(inventario.id, inventario.tipo)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Criar Demanda
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Demandas */}
        <TabsContent value="demandas" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Demandas */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Demandas de Contagem</CardTitle>
                      <CardDescription>
                        Gerencie as demandas de contagem por operador
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Demanda 1 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">Contagem - Prateleiras 1-5</h3>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            Em Andamento
                          </Badge>
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400">
                            Alta Prioridade
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>João Silva</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Setor A - Prateleiras 1-5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>40% concluído</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>

                    {/* Demanda 2 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">Contagem - Prateleiras 6-10</h3>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                            Pendente
                          </Badge>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                            Média Prioridade
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Maria Santos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Setor A - Prateleiras 6-10</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Início: 20/01/2024</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>

                    {/* Demanda 3 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">Contagem - Setor B</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Concluído
                          </Badge>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Baixa Prioridade
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Pedro Costa</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Setor B - Completo</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>100% concluído</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          Relatório
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Painel de Controle */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de Demandas:</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Em Andamento:</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pendentes:</span>
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Concluídas:</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Operadores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm">João Silva</span>
                    <Badge variant="secondary" className="text-xs">3 demandas</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm">Maria Santos</span>
                    <Badge variant="secondary" className="text-xs">2 demandas</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm">Pedro Costa</span>
                    <Badge variant="secondary" className="text-xs">1 demanda</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Demanda
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gerenciar Operadores
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Seleção de Operador e Endereço */}
      {showOperadorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Criar Demanda</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione o operador e endereço para a demanda
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Seleção de Operador */}
                <div className="space-y-2">
                  <Label htmlFor="operador">Operador</Label>
                  <Select value={selectedOperador} onValueChange={setSelectedOperador}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {operadores
                        .filter(op => op.status === "disponível")
                        .map(operador => (
                          <SelectItem key={operador.id} value={operador.nome}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{operador.nome}</span>
                              <Badge variant="secondary" className="text-xs">
                                {operador.setor}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Endereço - Sistema Simplificado */}
                <div className="space-y-4">
                  <Label>Endereço</Label>
                  
                  {/* Toggle entre modo manual e seletor */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={modoEndereco === "manual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setModoEndereco("manual")}
                    >
                      Digitar
                    </Button>
                    <Button
                      type="button"
                      variant={modoEndereco === "seletor" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setModoEndereco("seletor")}
                    >
                      Selecionar
                    </Button>
                  </div>

                  {modoEndereco === "manual" ? (
                    /* Modo Manual - Digitação direta */
                    <div className="space-y-2">
                      <Label htmlFor="endereco-manual" className="text-sm">Digite o endereço</Label>
                      <Input
                        id="endereco-manual"
                        placeholder="Ex: A 001 0001 10"
                        value={enderecoDigitado}
                        onChange={(e) => setEnderecoDigitado(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Formato: Galpão Rua Endereço Nível (Ex: A 001 0001 10)
                      </p>
                    </div>
                  ) : (
                    /* Modo Seletor - Seleção rápida */
                    <div className="space-y-2">
                      <Label htmlFor="endereco-rapido" className="text-sm">Selecione um endereço</Label>
                      <Select value={enderecoDigitado} onValueChange={setEnderecoDigitado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um endereço" />
                        </SelectTrigger>
                        <SelectContent>
                          {enderecosRapidos.map(endereco => (
                            <SelectItem key={endereco} value={endereco}>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{endereco}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Preview do endereço */}
                  {enderecoDigitado && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Endereço:</span>
                        <Badge variant="outline">
                          {enderecoDigitado}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informações do Inventário */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">Tipo de Inventário:</span>
                    <Badge variant="outline">
                      {selectedTipoInventario === "produtos" && "Produtos"}
                      {selectedTipoInventario === "materiais" && "Materiais"}
                      {selectedTipoInventario === "equipamentos" && "Equipamentos"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancelarOperador}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleConfirmarOperador}
                  disabled={!selectedOperador || !enderecoDigitado}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Demanda
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 