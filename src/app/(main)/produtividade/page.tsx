import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Loader2, Package2, Package, Plus } from "lucide-react";

const processos = [
  {
    numero: "52706749",
    cod1: "6201",
    cod2: "2285",
    status: "SEPARACAO",
    horario: "14:07 → 15:22",
    codigo: "584880",
    operador: "RAFAEL FERRANCINI DE CARVALHO",
    caixas: 93,
    unid: 0,
    vis: 43,
    produt: "75.4/h",
    concluido: true,
  },
  {
    numero: "52706748",
    cod1: "6201",
    cod2: "2286",
    status: "SEPARACAO",
    horario: "14:07 → 14:48",
    codigo: "566492",
    operador: "WANDERSON CANDIDO DA COSTA DUARTE",
    caixas: 31,
    unid: 0,
    vis: 17,
    produt: "46.5/h",
    concluido: true,
  },
  {
    numero: "52706745",
    cod1: "6201",
    cod2: "2287",
    status: "SEPARACAO",
    horario: "14:08 → 15:11",
    codigo: "564595",
    operador: "ALEXANDRE BORGES DE ANDRADE",
    caixas: 141,
    unid: 0,
    vis: 33,
    produt: "136.5/h",
    concluido: true,
  },
];

export default function Produtividade() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard de Produtividade</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral dos processos logísticos</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="default" className="flex gap-2 items-center">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar Processo</span>
          </Button>
          <Button variant="default" className="flex gap-2 items-center">
            <span className="hidden sm:inline">Finalizar Processo</span>
          </Button>
          <Button size="icon" variant="default" aria-label="Ação rápida" />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium text-primary">Total de Processos</div>
              <div className="text-2xl font-bold text-foreground mt-1">175</div>
            </div>
            <Package2 className="w-7 h-7 text-primary" />
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Em Andamento</div>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">7</div>
            </div>
            <Loader2 className="w-7 h-7 text-yellow-400 animate-spin" />
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">Concluídos</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">168</div>
            </div>
            <Check className="w-7 h-7 text-green-400" />
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-400">Total de Caixas</div>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300 mt-1">30215</div>
            </div>
            <Package className="w-7 h-7 text-purple-400" />
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-sm">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-400">Produtividade</div>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-300 mt-1">145.6</div>
            </div>
            <Package className="w-7 h-7 text-purple-400" />
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card className="bg-card border border-border shadow-none">
        <CardContent className="p-3 flex flex-col sm:flex-row gap-2 items-center">
          <Input
            type="text"
            placeholder="Buscar processo, operador, etc..."
            className="flex-1 min-w-0 bg-background"
            aria-label="Buscar processo, operador, etc."
          />
          <div className="flex gap-1 w-full sm:w-auto justify-end">
            <Button variant="ghost" size="sm">Todos</Button>
            <Button variant="ghost" size="sm">Em andamento</Button>
            <Button variant="ghost" size="sm">Concluído</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Processos */}
      <div className="space-y-2">
        {processos.map((proc) => (
          <Card key={proc.numero} className="p-0 bg-card border border-border shadow-sm rounded-xl">
            <CardContent className="p-3 space-y-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 w-full">
                {/* Esquerda: Info principal */}
                <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                  <span className="font-bold text-base text-foreground">#{proc.numero}</span>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">{proc.cod1}</Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">{proc.cod2}</Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">{proc.status}</Badge>
                  <span className="truncate text-xs text-muted-foreground max-w-[160px]">{proc.operador}</span>
                </div>
                {/* Direita: Métricas em linha */}
                <div className="flex flex-row items-center gap-4 min-w-fit mt-2 md:mt-0">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground">Caixas</span>
                    <span className="font-semibold text-sm text-foreground">{proc.caixas}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground">Unid.</span>
                    <span className="font-semibold text-sm text-foreground">{proc.unid}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground">Vis.</span>
                    <span className="font-semibold text-sm text-foreground">{proc.vis}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-muted-foreground">Produt.</span>
                    <Badge variant="default" className="text-xs px-2 py-0.5 font-bold bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                      {proc.produt}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center">
                    {proc.concluido ? (
                      <Check className="w-6 h-6 text-green-600 bg-muted rounded-full p-1" aria-label="Concluído" />
                    ) : (
                      <Loader2 className="w-6 h-6 text-yellow-500 animate-spin bg-muted rounded-full p-1" aria-label="Em andamento" />
                    )}
                  </div>
                </div>
              </div>
              {/* Linha inferior: horário e código */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pl-1">
                <span>{proc.horario}</span>
                <span>{proc.codigo}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}