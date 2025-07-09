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
  Package, 
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
  Target,
  BarChart3,
  FileText,
  Building,
  Grid3X3,
  Tag,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Star,
  Eye,
  Edit,
  Copy,
  Download,
  Upload,
  Settings,
  Database,
  Layers,
  Box,
  Palette,
  Scale,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Produtos() {
  const [activeTab, setActiveTab] = useState("cadastro");

  // MOCK: Lista de produtos
  const produtos = [
    {
      id: "prod-1",
      codigo: "PROD001",
      nome: "Smartphone Galaxy S23",
      categoria: "Eletrônicos",
      marca: "Samsung",
      preco: 2999.99,
      estoque: 45,
      status: "Ativo",
      badgeStatus: "bg-green-500/10 text-green-600 dark:text-green-400",
      ultimaAtualizacao: "15/01/2024",
      localizacao: "A 001 0001 05"
    },
    {
      id: "prod-2",
      codigo: "PROD002",
      nome: "Notebook Dell Inspiron",
      categoria: "Eletrônicos",
      marca: "Dell",
      preco: 4599.99,
      estoque: 12,
      status: "Ativo",
      badgeStatus: "bg-green-500/10 text-green-600 dark:text-green-400",
      ultimaAtualizacao: "14/01/2024",
      localizacao: "A 001 0002 03"
    },
    {
      id: "prod-3",
      codigo: "PROD003",
      nome: "Fone de Ouvido Bluetooth",
      categoria: "Acessórios",
      marca: "JBL",
      preco: 299.99,
      estoque: 78,
      status: "Ativo",
      badgeStatus: "bg-green-500/10 text-green-600 dark:text-green-400",
      ultimaAtualizacao: "13/01/2024",
      localizacao: "B 001 0001 02"
    },
    {
      id: "prod-4",
      codigo: "PROD004",
      nome: "Mouse Gamer RGB",
      categoria: "Acessórios",
      marca: "Logitech",
      preco: 199.99,
      estoque: 0,
      status: "Sem Estoque",
      badgeStatus: "bg-red-500/10 text-red-600 dark:text-red-400",
      ultimaAtualizacao: "12/01/2024",
      localizacao: "B 001 0002 01"
    },
    {
      id: "prod-5",
      codigo: "PROD005",
      nome: "Teclado Mecânico",
      categoria: "Acessórios",
      marca: "Corsair",
      preco: 599.99,
      estoque: 23,
      status: "Ativo",
      badgeStatus: "bg-green-500/10 text-green-600 dark:text-green-400",
      ultimaAtualizacao: "11/01/2024",
      localizacao: "B 002 0001 04"
    }
  ];

  // MOCK: Categorias
  const categorias = [
    { id: 1, nome: "Eletrônicos", quantidade: 156, status: "Ativa" },
    { id: 2, nome: "Acessórios", quantidade: 89, status: "Ativa" },
    { id: 3, nome: "Informática", quantidade: 234, status: "Ativa" },
    { id: 4, nome: "Gaming", quantidade: 67, status: "Ativa" },
    { id: 5, nome: "Mobile", quantidade: 123, status: "Ativa" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e controle de produtos, categorias e estoque
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
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cadastro" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Produto
          </TabsTrigger>
          <TabsTrigger value="produtos" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="categorias" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="estoque" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Estoque
          </TabsTrigger>
        </TabsList>

        {/* Tab: Novo Produto */}
        <TabsContent value="cadastro" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulário de Cadastro */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Novo Produto</CardTitle>
                      <CardDescription>
                        Configure as informações do produto
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código do Produto *</Label>
                      <Input
                        id="codigo"
                        placeholder="Ex: PROD001"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Produto *</Label>
                      <Input
                        id="nome"
                        placeholder="Nome completo do produto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                          <SelectItem value="acessorios">Acessórios</SelectItem>
                          <SelectItem value="informatica">Informática</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="mobile">Mobile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        placeholder="Marca do produto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preco">Preço *</Label>
                      <Input
                        id="preco"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estoque">Estoque Inicial *</Label>
                      <Input
                        id="estoque"
                        type="number"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <textarea
                        id="descricao"
                        className="w-full p-2 border rounded-md bg-background text-foreground min-h-[100px] resize-none"
                        placeholder="Descrição detalhada do produto..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização no Armazém</Label>
                      <Input
                        id="localizacao"
                        placeholder="Ex: A 001 0001 05"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">
                      Cancelar
                    </Button>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Produto
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
                    <span className="text-sm text-muted-foreground">Categoria:</span>
                    <span className="text-sm font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <span className="text-sm font-medium">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
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
                    <span>1. Preencher dados básicos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>2. Definir categoria</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>3. Configurar preço</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span>4. Definir localização</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Produtos */}
        <TabsContent value="produtos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Produtos</CardTitle>
                  <CardDescription>
                    Visualize e gerencie todos os produtos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {produtos.map((produto) => (
                  <div key={produto.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground">{produto.nome}</h3>
                        <Badge variant="outline" className={produto.badgeStatus}>
                          {produto.status}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {produto.categoria}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{produto.codigo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span>R$ {produto.preco.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          <span>{produto.estoque} unidades</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{produto.localizacao}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Categorias */}
        <TabsContent value="categorias" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Categorias */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Tag className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle>Categorias</CardTitle>
                      <CardDescription>
                        Gerencie as categorias de produtos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categorias.map((categoria) => (
                      <div key={categoria.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-foreground">{categoria.nome}</h3>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                              {categoria.status}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {categoria.quantidade} produtos
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              <span>Produtos ativos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>Vendas crescentes</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Produtos
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Painel de Controle */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de Categorias:</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Categorias Ativas:</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de Produtos:</span>
                    <span className="text-sm font-medium">669</span>
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
                    Nova Categoria
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Relatório
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Estoque */}
        <TabsContent value="estoque" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Estoque */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Database className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle>Controle de Estoque</CardTitle>
                      <CardDescription>
                        Monitore o estoque e movimentações
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Produto com estoque baixo */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors border-orange-200 bg-orange-50/30">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">Mouse Gamer RGB</h3>
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            Estoque Baixo
                          </Badge>
                          <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400">
                            Crítico
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            <span>0 unidades</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Mínimo: 10</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Última movimentação: 12/01/2024</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Repor
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Histórico
                        </Button>
                      </div>
                    </div>

                    {/* Produto com estoque normal */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">Smartphone Galaxy S23</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Estoque OK
                          </Badge>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            Normal
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            <span>45 unidades</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Mínimo: 5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Vendas: 12/mês</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Histórico
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Ajustar
                        </Button>
                      </div>
                    </div>

                    {/* Produto com estoque alto */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">Fone de Ouvido Bluetooth</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                            Estoque Alto
                          </Badge>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                            Atenção
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            <span>78 unidades</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Máximo: 50</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Vendas: 8/mês</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Histórico
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Ajustar
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
                  <CardTitle className="text-lg">Resumo do Estoque</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de Produtos:</span>
                    <span className="text-sm font-medium">669</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Em Estoque:</span>
                    <span className="text-sm font-medium">645</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estoque Baixo:</span>
                    <span className="text-sm font-medium text-orange-600">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sem Estoque:</span>
                    <span className="text-sm font-medium text-red-600">9</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alertas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-950/20">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm">9 produtos sem estoque</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-orange-50 dark:bg-orange-950/20">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">15 produtos com estoque baixo</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950/20">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">3 produtos com estoque alto</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Estoque
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Relatório
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Análise de Estoque
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 