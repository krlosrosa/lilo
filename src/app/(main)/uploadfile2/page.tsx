"use client"

import { useState } from "react";
import { Upload, FileText, Package, Route, CheckCircle, AlertCircle, Settings, Printer, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface FileUpload {
  id: string;
  name: string;
  size: string;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingProducts: string[];
  missingTransports: string[];
  routingInfo: {
    hasRouting: boolean;
    missingFields: string[];
  };
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState<{
    remessa: FileUpload | null;
    produto: FileUpload | null;
    roteirizacao: FileUpload | null;
  }>({
    remessa: {
      id: "1",
      name: "remessa_2024.csv",
      size: "2.5 MB",
      status: "success",
      progress: 100,
    },
    produto: {
      id: "2", 
      name: "produtos_2024.xlsx",
      size: "1.8 MB",
      status: "success",
      progress: 100,
    },
    roteirizacao: null,
  });

  // Simulated validation results - with sample data to demonstrate feedbacks
  const [validationResults, setValidationResults] = useState<ValidationResult>({
    isValid: false,
    errors: ["Formato de arquivo inválido detectado"],
    warnings: ["Alguns produtos podem ter preços desatualizados"],
    missingProducts: ["PROD001", "PROD002", "PROD003", "PROD004"],
    missingTransports: ["TRANS001", "TRANS002"],
    routingInfo: {
      hasRouting: false,
      missingFields: ["placa", "rota", "cliente"]
    }
  });

  const [isValidating, setIsValidating] = useState(false);

  // Estados para configurações
  const [configuracoes, setConfiguracoes] = useState({
    tipoSeparacao: 'cliente', // 'cliente' ou 'transporte'
    agruparClientes: false,
    agruparTransporte: false,
    segregarClientes: false,
    adicionarRange: false,
    percentualMinimo: 0,
    percentualMaximo: 100,
    quebrarPallet: false,
    percentualQuebra: 50,
    palletImpressao: 'mesma', // 'separada' ou 'mesma'
    unidadeImpressao: 'mesma', // 'separada' ou 'mesma'
    segregarFifo: false,
    faixasFifo: [] as number[],
    ordenacao: [
      { campo: 'cliente', ordem: 'asc' },
      { campo: 'localizacao', ordem: 'asc' },
      { campo: 'codigo_produto', ordem: 'asc' }
    ] as Array<{campo: string, ordem: 'asc' | 'desc'}>,
    informacoesMapa: [
      'Código do Produto',
      'Descrição do Produto', 
      'Quantidade',
      'Localização',
      'Cliente',
      'Transporte',
      'Data de Separação',
      'Responsável',
      'Observações'
    ] as string[]
  });

  const handleFileSelect = (type: keyof typeof files, file: File) => {
    const fileUpload: FileUpload = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: "idle",
      progress: 0,
    };

    setFiles(prev => ({
      ...prev,
      [type]: fileUpload,
    }));
  };

  const handleUpload = (type: keyof typeof files) => {
    const file = files[type];
    if (!file) return;

    setFiles(prev => ({
      ...prev,
      [type]: { ...file, status: "uploading", progress: 0 },
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prev => {
        const currentFile = prev[type];
        if (!currentFile) return prev;

        const newProgress = currentFile.progress + Math.random() * 30;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [type]: { ...currentFile, status: "success", progress: 100 },
          };
        }

        return {
          ...prev,
          [type]: { ...currentFile, progress: newProgress },
        };
      });
    }, 200);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateValidation = async () => {
    setIsValidating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use the predefined validation results to demonstrate feedbacks
    setValidationResults(validationResults);
    setIsValidating(false);
  };

  const handleTabChange = (tab: string) => {
    if (tab === "validacao" && files.remessa && files.produto) {
      simulateValidation();
    }
    setActiveTab(tab);
  };

  const handleConfiguracaoChange = (key: string, value: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFaixaFifoChange = (faixa: number, checked: boolean) => {
    setConfiguracoes(prev => ({
      ...prev,
      faixasFifo: checked 
        ? [...prev.faixasFifo, faixa]
        : prev.faixasFifo.filter(f => f !== faixa)
    }));
  };

  const handleInformacaoMapaChange = (info: string, checked: boolean) => {
    setConfiguracoes(prev => ({
      ...prev,
      informacoesMapa: checked 
        ? [...prev.informacoesMapa, info]
        : prev.informacoesMapa.filter(i => i !== info)
    }));
  };

  const handleOrdenacaoChange = (index: number, campo: string, ordem: 'asc' | 'desc') => {
    setConfiguracoes(prev => ({
      ...prev,
      ordenacao: prev.ordenacao.map((item, i) => 
        i === index ? { campo, ordem } : item
      )
    }));
  };

  const addOrdenacao = () => {
    setConfiguracoes(prev => ({
      ...prev,
      ordenacao: [...prev.ordenacao, { campo: 'cliente', ordem: 'asc' }]
    }));
  };

  const removeOrdenacao = (index: number) => {
    setConfiguracoes(prev => ({
      ...prev,
      ordenacao: prev.ordenacao.filter((_, i) => i !== index)
    }));
  };

  const getStatusIcon = (status: FileUpload["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: FileUpload["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "error":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      case "uploading":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const uploadConfigs = [
    {
      key: "remessa" as const,
      title: "Arquivo de Remessa",
      description: "Upload do arquivo de remessa (.csv, .xlsx)",
      icon: Package,
      accept: ".csv,.xlsx,.xls",
    },
    {
      key: "produto" as const,
      title: "Arquivo de Produtos",
      description: "Upload do arquivo de produtos (.csv, .xlsx)",
      icon: FileText,
      accept: ".csv,.xlsx,.xls",
    },
    {
      key: "roteirizacao" as const,
      title: "Arquivo de Roteirização",
      description: "Upload do arquivo de roteirização (.csv, .xlsx)",
      icon: Route,
      accept: ".csv,.xlsx,.xls",
    },
  ];

  const renderUploadTab = () => (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadConfigs.map((config) => {
          const file = files[config.key];
          const Icon = config.icon;

          return (
            <Card key={config.key} className="relative hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">{config.title}</CardTitle>
                    <CardDescription className="text-sm">{config.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!file ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all duration-200 hover:bg-muted/30">
                    <div className="p-3 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 font-medium">
                      Clique para selecionar ou arraste o arquivo
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Formatos aceitos: {config.accept}
                    </p>
                    <input
                      type="file"
                      accept={config.accept}
                      className="hidden"
                      id={`file-${config.key}`}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          handleFileSelect(config.key, selectedFile);
                        }
                      }}
                    />
                    <label htmlFor={`file-${config.key}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Arquivo
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className={cn("border rounded-lg p-4 transition-all duration-200", getStatusColor(file.status))}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-background border">
                        {getStatusIcon(file.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                      <Badge 
                        variant={file.status === "success" ? "default" : file.status === "error" ? "destructive" : "secondary"}
                        className="text-xs font-medium"
                      >
                        {file.status === "idle" && "Pronto"}
                        {file.status === "uploading" && "Enviando"}
                        {file.status === "success" && "Concluído"}
                        {file.status === "error" && "Erro"}
                      </Badge>
                    </div>
                    
                    {file.status === "uploading" && (
                      <div className="space-y-3">
                        <Progress value={file.progress} className="h-2" />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Progresso do upload</span>
                          <span>{Math.round(file.progress)}%</span>
                        </div>
                      </div>
                    )}

                    {file.status === "idle" && (
                      <Button 
                        onClick={() => handleUpload(config.key)}
                        className="w-full"
                        size="sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Iniciar Upload
                      </Button>
                    )}

                    {file.status === "success" && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setFiles(prev => ({ ...prev, [config.key]: null }))}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Trocar Arquivo
                        </Button>
                      </div>
                    )}

                    {file.status === "error" && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setFiles(prev => ({ ...prev, [config.key]: null }))}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Tentar Novamente
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderValidacaoTab = () => {
    const hasErrors = validationResults.errors.length > 0;
    const hasWarnings = validationResults.warnings.length > 0;
    const hasMissingProducts = validationResults.missingProducts.length > 0;
    const hasMissingTransports = validationResults.missingTransports.length > 0;
    const hasRoutingIssues = !validationResults.routingInfo.hasRouting || validationResults.routingInfo.missingFields.length > 0;

    if (isValidating) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Validação de Arquivos</CardTitle>
                  <CardDescription>
                    Verificação da integridade e conformidade dos arquivos enviados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-muted-foreground">Validando arquivos...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Validação de Arquivos</CardTitle>
                <CardDescription>
                  Verificação da integridade e conformidade dos arquivos enviados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Validation Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Arquivo de Remessa</p>
                    <p className="text-sm text-muted-foreground">Validado com sucesso</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                  Válido
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Arquivo de Produtos</p>
                    <p className="text-sm text-muted-foreground">Validado com sucesso</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                  Válido
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Arquivo de Roteirização</p>
                    <p className="text-sm text-muted-foreground">Validado com sucesso</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                  Válido
                </Badge>
              </div>
            </div>

            {/* Validation Issues */}
            {(hasErrors || hasWarnings || hasMissingProducts || hasMissingTransports || hasRoutingIssues) && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-foreground">Detalhes da Validação</h4>
                
                {/* Missing Products */}
                {hasMissingProducts && (
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <h5 className="font-medium text-destructive">Produtos não cadastrados</h5>
                    </div>
                    <p className="text-sm text-destructive/80 mb-2">
                      Os seguintes produtos precisam ser cadastrados no sistema para gerar o mapa de separação:
                    </p>
                    <div className="space-y-1">
                      {validationResults.missingProducts.map((product, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          <span className="text-sm text-destructive/90 font-mono">{product}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-destructive/70 mt-2">
                      ⚠️ É necessário cadastrar estes produtos para fazer as conversões necessárias no mapa.
                    </p>
                  </div>
                )}

                {/* Missing Transports */}
                {hasMissingTransports && (
                  <div className="p-4 border border-orange-200/20 rounded-lg bg-orange-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <h5 className="font-medium text-orange-600 dark:text-orange-400">Transportes não cadastrados</h5>
                    </div>
                    <p className="text-sm text-orange-600/80 dark:text-orange-400/80 mb-2">
                      Os seguintes transportes precisam ser cadastrados no sistema para processamento:
                    </p>
                    <div className="space-y-1">
                      {validationResults.missingTransports.map((transport, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-orange-600/90 dark:text-orange-400/90 font-mono">{transport}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-2">
                      ⚠️ O cadastro de transportes é necessário para identificar veículos e rotas de entrega.
                    </p>
                  </div>
                )}

                {/* Routing Information */}
                {hasRoutingIssues && (
                  <div className="p-4 border border-blue-200/20 rounded-lg bg-blue-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <h5 className="font-medium text-blue-600 dark:text-blue-400">Informações de Roteirização</h5>
                    </div>
                    {!validationResults.routingInfo.hasRouting ? (
                      <div>
                        <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mb-2">
                          <strong>Arquivo de roteirização não fornecido.</strong>
                        </p>
                        <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                          ⚠️ A roteirização não é obrigatória, mas é recomendada para obter informações de:
                        </p>
                        <ul className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-2 space-y-1">
                          <li>• Placa do veículo</li>
                          <li>• Rota de entrega</li>
                          <li>• Dados do cliente</li>
                          <li>• Sequência de separação otimizada</li>
                          <li>• Informações do motorista</li>
                          <li>• Telefone de contato</li>
                        </ul>
                        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
                          💡 Sem roteirização, o mapa será gerado sem informações de entrega específicas.
                        </p>
                      </div>
                                          ) : (
                        <div>
                          <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mb-2">
                            Arquivo de roteirização fornecido, mas com campos faltantes:
                          </p>
                          <div className="space-y-1">
                            {validationResults.routingInfo.missingFields.map((field, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-blue-600/90 dark:text-blue-400/90 capitalize">{field}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* General Errors */}
                {hasErrors && (
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <h5 className="font-medium text-destructive">Erros de Validação</h5>
                    </div>
                    <div className="space-y-1">
                      {validationResults.errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-destructive rounded-full"></div>
                          <span className="text-sm text-destructive/90">{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {hasWarnings && (
                  <div className="p-4 border border-yellow-200/20 rounded-lg bg-yellow-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <h5 className="font-medium text-yellow-600 dark:text-yellow-400">Avisos</h5>
                    </div>
                    <div className="space-y-1">
                      {validationResults.warnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-yellow-600/90 dark:text-yellow-400/90">{warning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {!hasErrors && !hasMissingProducts && !hasMissingTransports && (
              <div className="p-4 border border-green-200/20 rounded-lg bg-green-500/5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <h5 className="font-medium text-green-600 dark:text-green-400">Validação Concluída</h5>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      Todos os arquivos foram validados com sucesso e estão prontos para processamento.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              setValidationResults({
                isValid: true,
                errors: [],
                warnings: [],
                missingProducts: [],
                missingTransports: [],
                routingInfo: {
                  hasRouting: true,
                  missingFields: []
                }
              });
            }}
            size="sm"
          >
            Cenário Sucesso
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setValidationResults({
                isValid: false,
                errors: ["Formato de arquivo inválido", "Arquivo corrompido detectado"],
                warnings: ["Alguns produtos podem ter preços desatualizados"],
                missingProducts: ["PROD001", "PROD002", "PROD003", "PROD004", "PROD005"],
                missingTransports: ["TRANS001", "TRANS002", "TRANS003", "TRANS004"],
                routingInfo: {
                  hasRouting: false,
                  missingFields: ["placa", "rota", "cliente", "motorista"]
                }
              });
            }}
            size="sm"
          >
            Cenário Erro Completo
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setValidationResults({
                isValid: false,
                errors: [],
                warnings: [],
                missingProducts: [],
                missingTransports: ["TRANS001", "TRANS002", "TRANS003", "TRANS004", "TRANS005"],
                routingInfo: {
                  hasRouting: false,
                  missingFields: ["placa", "rota", "cliente"]
                }
              });
            }}
            size="sm"
          >
            Apenas Transportes
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setValidationResults({
                isValid: false,
                errors: [],
                warnings: ["Produtos com preços desatualizados"],
                missingProducts: ["PROD001", "PROD002", "PROD003", "PROD004", "PROD005", "PROD006"],
                missingTransports: [],
                routingInfo: {
                  hasRouting: true,
                  missingFields: ["motorista"]
                }
              });
            }}
            size="sm"
          >
            Apenas Produtos
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setValidationResults({
                isValid: true,
                errors: [],
                warnings: [],
                missingProducts: [],
                missingTransports: [],
                routingInfo: {
                  hasRouting: false,
                  missingFields: ["placa", "rota", "cliente", "motorista", "telefone"]
                }
              });
            }}
            size="sm"
          >
            Apenas Roteirização
          </Button>
        </div>
      </div>
    );
  };

  const renderConfiguracaoTab = () => {
    const [activeConfigTab, setActiveConfigTab] = useState("separacao");

    return (
      <div className="space-y-6">
        <div className="flex gap-6">
          {/* Tabs Verticais */}
          <div className="w-64 space-y-2">
            <div 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeConfigTab === "separacao" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setActiveConfigTab("separacao")}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Tipo de Separação</span>
              </div>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeConfigTab === "range" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setActiveConfigTab("range")}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Range de Data</span>
              </div>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeConfigTab === "pallet" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setActiveConfigTab("pallet")}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Quebra de Pallet</span>
              </div>
            </div>
            
            <div 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeConfigTab === "parametros" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setActiveConfigTab("parametros")}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Parâmetros</span>
              </div>
            </div>
          </div>

          {/* Conteúdo dos Tabs */}
          <div className="flex-1">
            {activeConfigTab === "separacao" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Tipo de Separação</CardTitle>
                      <CardDescription>
                        Configure como os itens serão organizados no mapa
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="cliente" 
                        name="tipo-separacao" 
                        className="text-primary"
                        checked={configuracoes.tipoSeparacao === 'cliente'}
                        onChange={() => handleConfiguracaoChange('tipoSeparacao', 'cliente')}
                      />
                      <label htmlFor="cliente" className="text-sm font-medium">Por Cliente</label>
                    </div>
                    {configuracoes.tipoSeparacao === 'cliente' && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="agrupar-clientes" 
                            className="text-primary"
                            checked={configuracoes.agruparClientes}
                            onChange={(e) => handleConfiguracaoChange('agruparClientes', e.target.checked)}
                          />
                          <label htmlFor="agrupar-clientes" className="text-sm text-muted-foreground">Agrupar clientes</label>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="transporte" 
                        name="tipo-separacao" 
                        className="text-primary"
                        checked={configuracoes.tipoSeparacao === 'transporte'}
                        onChange={() => handleConfiguracaoChange('tipoSeparacao', 'transporte')}
                      />
                      <label htmlFor="transporte" className="text-sm font-medium">Por Transporte</label>
                    </div>
                    {configuracoes.tipoSeparacao === 'transporte' && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="agrupar-transporte" 
                            className="text-primary"
                            checked={configuracoes.agruparTransporte}
                            onChange={(e) => handleConfiguracaoChange('agruparTransporte', e.target.checked)}
                          />
                          <label htmlFor="agrupar-transporte" className="text-sm text-muted-foreground">Agrupar transporte</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="segregar-clientes" 
                            className="text-primary"
                            checked={configuracoes.segregarClientes}
                            onChange={(e) => handleConfiguracaoChange('segregarClientes', e.target.checked)}
                          />
                          <label htmlFor="segregar-clientes" className="text-sm text-muted-foreground">Segregar clientes</label>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeConfigTab === "range" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle>Range de Data</CardTitle>
                      <CardDescription>
                        Configure o período de separação e percentuais
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="adicionar-range" 
                      className="text-primary"
                      checked={configuracoes.adicionarRange}
                      onChange={(e) => handleConfiguracaoChange('adicionarRange', e.target.checked)}
                    />
                    <label htmlFor="adicionar-range" className="text-sm font-medium">Adicionar range de data de separação</label>
                  </div>
                  
                  {configuracoes.adicionarRange && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Percentual Mínimo (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          className="w-full p-2 border rounded-md bg-background text-foreground"
                          placeholder="0"
                          value={configuracoes.percentualMinimo}
                          onChange={(e) => handleConfiguracaoChange('percentualMinimo', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Percentual Máximo (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          className="w-full p-2 border rounded-md bg-background text-foreground"
                          placeholder="100"
                          value={configuracoes.percentualMaximo}
                          onChange={(e) => handleConfiguracaoChange('percentualMaximo', parseInt(e.target.value) || 100)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeConfigTab === "pallet" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle>Quebra de Pallet</CardTitle>
                      <CardDescription>
                        Configure se deseja quebrar pallets e o percentual
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="quebra-pallet" 
                      className="text-primary"
                      checked={configuracoes.quebrarPallet}
                      onChange={(e) => handleConfiguracaoChange('quebrarPallet', e.target.checked)}
                    />
                    <label htmlFor="quebra-pallet" className="text-sm font-medium">Quebrar pallet</label>
                  </div>
                  
                  {configuracoes.quebrarPallet && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Percentual de Quebra (%)</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        className="w-full p-2 border rounded-md bg-background text-foreground"
                        placeholder="50"
                        value={configuracoes.percentualQuebra}
                        onChange={(e) => handleConfiguracaoChange('percentualQuebra', parseInt(e.target.value) || 50)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeConfigTab === "parametros" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <FileText className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Parâmetros de Impressão</CardTitle>
                      <CardDescription>
                        Configure como as informações serão exibidas no mapa
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pallet e Unidade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Pallet</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="pallet-separada" 
                            name="pallet" 
                            className="text-primary"
                            checked={configuracoes.palletImpressao === 'separada'}
                            onChange={() => handleConfiguracaoChange('palletImpressao', 'separada')}
                          />
                          <label htmlFor="pallet-separada" className="text-sm">Imprimir em folha separada</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="pallet-mesma" 
                            name="pallet" 
                            className="text-primary"
                            checked={configuracoes.palletImpressao === 'mesma'}
                            onChange={() => handleConfiguracaoChange('palletImpressao', 'mesma')}
                          />
                          <label htmlFor="pallet-mesma" className="text-sm">Imprimir na mesma folha</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Unidade</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="unidade-separada" 
                            name="unidade" 
                            className="text-primary"
                            checked={configuracoes.unidadeImpressao === 'separada'}
                            onChange={() => handleConfiguracaoChange('unidadeImpressao', 'separada')}
                          />
                          <label htmlFor="unidade-separada" className="text-sm">Imprimir em folha separada</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="unidade-mesma" 
                            name="unidade" 
                            className="text-primary"
                            checked={configuracoes.unidadeImpressao === 'mesma'}
                            onChange={() => handleConfiguracaoChange('unidadeImpressao', 'mesma')}
                          />
                          <label htmlFor="unidade-mesma" className="text-sm">Imprimir na mesma folha</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segregar FIFO */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="segregar-fifo" 
                        className="text-primary"
                        checked={configuracoes.segregarFifo}
                        onChange={(e) => handleConfiguracaoChange('segregarFifo', e.target.checked)}
                      />
                      <label htmlFor="segregar-fifo" className="text-sm font-medium">Segregar FIFO</label>
                    </div>
                    
                    {configuracoes.segregarFifo && (
                      <div className="ml-6 space-y-3">
                        <p className="text-sm text-muted-foreground">Selecione quais faixas deseja segregar:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['Faixa 1', 'Faixa 2', 'Faixa 3', 'Faixa 4', 'Faixa 5', 'Faixa 6', 'Faixa 7', 'Faixa 8'].map((faixa, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id={`faixa-${index + 1}`} 
                                className="text-primary"
                                checked={configuracoes.faixasFifo.includes(index + 1)}
                                onChange={(e) => handleFaixaFifoChange(index + 1, e.target.checked)}
                              />
                              <label htmlFor={`faixa-${index + 1}`} className="text-sm text-muted-foreground">{faixa}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ordenação */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Ordenação</h4>
                    <p className="text-sm text-muted-foreground">Configure a ordem de exibição dos itens no mapa:</p>
                    
                    <div className="space-y-3">
                      {configuracoes.ordenacao.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                          <span className="text-sm text-muted-foreground w-8">#{index + 1}</span>
                          
                          <select 
                            className="flex-1 p-2 border rounded-md bg-background text-foreground text-sm"
                            value={item.campo}
                            onChange={(e) => handleOrdenacaoChange(index, e.target.value, item.ordem)}
                          >
                            <option value="cliente">Cliente</option>
                            <option value="transporte">Transporte</option>
                            <option value="codigo_produto">Código do Produto</option>
                            <option value="descricao_produto">Descrição do Produto</option>
                            <option value="localizacao">Localização</option>
                            <option value="quantidade">Quantidade</option>
                            <option value="data_separacao">Data de Separação</option>
                            <option value="responsavel">Responsável</option>
                            <option value="prioridade">Prioridade</option>
                          </select>
                          
                          <select 
                            className="p-2 border rounded-md bg-background text-foreground text-sm"
                            value={item.ordem}
                            onChange={(e) => handleOrdenacaoChange(index, item.campo, e.target.value as 'asc' | 'desc')}
                          >
                            <option value="asc">Crescente (A-Z)</option>
                            <option value="desc">Decrescente (Z-A)</option>
                          </select>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeOrdenacao(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={addOrdenacao}
                        className="w-full"
                      >
                        + Adicionar Critério de Ordenação
                      </Button>
                    </div>
                  </div>

                  {/* Informações no Mapa */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Informações no Mapa</h4>
                    <p className="text-sm text-muted-foreground">Selecione quais informações devem aparecer no mapa:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Código do Produto',
                        'Descrição do Produto', 
                        'Quantidade',
                        'Localização',
                        'Cliente',
                        'Transporte',
                        'Data de Separação',
                        'Responsável',
                        'Observações'
                      ].map((info, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`info-${index}`} 
                            className="text-primary" 
                            checked={configuracoes.informacoesMapa.includes(info)}
                            onChange={(e) => handleInformacaoMapaChange(info, e.target.checked)}
                          />
                          <label htmlFor={`info-${index}`} className="text-sm text-muted-foreground">{info}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>


      </div>
    );
  };

  const renderImpressaoTab = () => {
    const [tipoImpressao, setTipoImpressao] = useState("separacao");
    const [showPreview, setShowPreview] = useState(false);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Configurações de Impressão */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Printer className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Tipo de Impressão</CardTitle>
                    <CardDescription>
                      Selecione o que deseja imprimir
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="separacao" 
                      name="tipo-impressao" 
                      className="text-primary"
                      checked={tipoImpressao === "separacao"}
                      onChange={() => setTipoImpressao("separacao")}
                    />
                    <label htmlFor="separacao" className="text-sm font-medium">Mapa de Separação</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="carregamento" 
                      name="tipo-impressao" 
                      className="text-primary"
                      checked={tipoImpressao === "carregamento"}
                      onChange={() => setTipoImpressao("carregamento")}
                    />
                    <label htmlFor="carregamento" className="text-sm font-medium">Mapa de Carregamento</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="reimpressao" 
                      name="tipo-impressao" 
                      className="text-primary"
                      checked={tipoImpressao === "reimpressao"}
                      onChange={() => setTipoImpressao("reimpressao")}
                    />
                    <label htmlFor="reimpressao" className="text-sm font-medium">Reimpressão</label>
                  </div>
                </div>
              </CardContent>
            </Card>



            <div className="space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowPreview(true)}
              >
                Visualizar Prévia
              </Button>
              
              <Button 
                variant="outline"
                className="w-full" 
                size="lg"
              >
                Gerar e Imprimir
              </Button>
            </div>
          </div>

          {/* Prévia do Mapa */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <FileText className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>Prévia do Mapa</CardTitle>
                      <CardDescription>
                        Visualização de como o mapa será impresso
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    {tipoImpressao === "separacao" && "Mapa de Separação"}
                    {tipoImpressao === "carregamento" && "Mapa de Carregamento"}
                    {tipoImpressao === "reimpressao" && "Reimpressão"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {showPreview ? (
                  <div className="space-y-4">
                    {/* Cabeçalho do Mapa */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">MAPEAMENTO DE SEPARAÇÃO</h3>
                          <p className="text-sm text-muted-foreground">Cliente: CLIENTE EXEMPLO LTDA</p>
                          <p className="text-sm text-muted-foreground">Transporte: TRANS001</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                          <p className="text-sm text-muted-foreground">Responsável: João Silva</p>
                        </div>
                      </div>
                    </div>

                    {/* Tabela de Itens */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="border p-2 text-left text-sm font-medium">#</th>
                            <th className="border p-2 text-left text-sm font-medium">Código</th>
                            <th className="border p-2 text-left text-sm font-medium">Descrição</th>
                            <th className="border p-2 text-left text-sm font-medium">Qtd</th>
                            <th className="border p-2 text-left text-sm font-medium">Local</th>
                            <th className="border p-2 text-left text-sm font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { codigo: "PROD001", descricao: "Produto A - Descrição Longa", qtd: 10, local: "A1-B2-C3", status: "Pendente" },
                            { codigo: "PROD002", descricao: "Produto B - Descrição Média", qtd: 5, local: "D4-E5-F6", status: "Pendente" },
                            { codigo: "PROD003", descricao: "Produto C - Descrição Curta", qtd: 15, local: "G7-H8-I9", status: "Pendente" },
                            { codigo: "PROD004", descricao: "Produto D - Descrição Muito Longa", qtd: 8, local: "J10-K11-L12", status: "Pendente" },
                            { codigo: "PROD005", descricao: "Produto E - Descrição", qtd: 12, local: "M13-N14-O15", status: "Pendente" },
                          ].map((item, index) => (
                            <tr key={index} className="hover:bg-muted/30">
                              <td className="border p-2 text-sm">{index + 1}</td>
                              <td className="border p-2 text-sm font-mono">{item.codigo}</td>
                              <td className="border p-2 text-sm">{item.descricao}</td>
                              <td className="border p-2 text-sm text-center">{item.qtd}</td>
                              <td className="border p-2 text-sm font-mono">{item.local}</td>
                              <td className="border p-2 text-sm">
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Rodapé do Mapa */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Observações:</p>
                          <p className="text-muted-foreground">Verificar validade dos produtos antes da separação</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Total de Itens: 5</p>
                          <p className="font-medium">Total de Quantidade: 50</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Clique em "Visualizar Prévia" para ver como o mapa será impresso</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    );
  };

  return (
    <div className="min-h-screen w-full">
      {/* Barra de Navegação Fixa */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Processo de Separação
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeTab === "upload" && "Faça upload dos arquivos necessários"}
                {activeTab === "validacao" && "Valide os arquivos enviados"}
                {activeTab === "configuracao" && "Configure os parâmetros do mapa"}
                {activeTab === "impressao" && "Visualize e imprima o mapa"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (activeTab === "validacao") handleTabChange("upload");
                  if (activeTab === "configuracao") handleTabChange("validacao");
                  if (activeTab === "impressao") handleTabChange("configuracao");
                }}
                disabled={activeTab === "upload"}
              >
                Voltar
              </Button>
              
              <Button 
                size="sm"
                onClick={() => {
                  if (activeTab === "upload") handleTabChange("validacao");
                  if (activeTab === "validacao") handleTabChange("configuracao");
                  if (activeTab === "configuracao") handleTabChange("impressao");
                }}
                disabled={
                  (activeTab === "upload" && (!files.remessa || !files.produto || 
                   files.remessa?.status !== "success" || files.produto?.status !== "success")) ||
                  (activeTab === "validacao" && (validationResults.errors.length > 0 || 
                   validationResults.missingProducts.length > 0 || validationResults.missingTransports.length > 0)) ||
                  activeTab === "impressao"
                }
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="validacao" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Validação
            </TabsTrigger>
            <TabsTrigger value="configuracao" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="impressao" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Impressão
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            {renderUploadTab()}
          </TabsContent>

          <TabsContent value="validacao" className="mt-6">
            {renderValidacaoTab()}
          </TabsContent>

          <TabsContent value="configuracao" className="mt-6">
            {renderConfiguracaoTab()}
          </TabsContent>

          <TabsContent value="impressao" className="mt-6">
            {renderImpressaoTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 