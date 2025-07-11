import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadPage from "../components/upload";
import { ValidateProducts } from "../../domain/validateProducts";
import { ValidateTransport } from "../../domain/validateTransport";
import { useDataStore } from "../store/dataStore";
import { useConfigPrintStore } from "../store/configPrint";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Validacao from "../components/validação";
import Configuracao from "../components/configuracao";
import { GenerateMap, GenerateMapResult } from "../../domain/generate-map";
import { PrintPage } from "../components/mapa/mapa";
import useMapaPrint from "../hooks/use-mapa-print";
import { ConvertXlsx } from "../../infra/convertXlsx";
import { ShipmentItem } from "../../types/shipment-type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Package, Truck, Upload as UploadIcon, CheckCircle, Settings, FileText, ArrowLeft, Printer, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PrintProtocol from "../components/print-protocol";
import { GenerateProtocol } from "../../domain/generate-protocol";

export interface FilesState {
  products: File | null;
  routes: File | null;
  shipments: File | null;
}

type UploadPage = {
  validateProducts: ValidateProducts;
  validateRoutes: ValidateTransport;
  generateMap: GenerateMap;
  generateProtocol: GenerateProtocol;
}

export default function MapaSeparacao({ validateProducts, validateRoutes, generateMap, generateProtocol }: UploadPage) {
  const router = useRouter();
  const { setValidateProducts, setValidateRoutes,  validateProducts: validateProductsStore, setMapData, setProductData } = useDataStore();
  const { config, setConfigCompat } = useConfigPrintStore();
  const [tab, setTab] = useState<string>('upload');
  const [map, setMap] = useState<GenerateMapResult | null>(null);
  const [shipment, setShipment] = useState<ShipmentItem[]>([]);
  const [tipoMapa, setTipoMapa] = useState<'separacao' | 'carregamento'>('separacao');

  const info = shipment.map(s => s.transport)

  const { componentRef, handlePrint } = useMapaPrint({
    transportes: info,
    
    onBeforePrint: async () => {
      console.log('Preparando impressão...');
    },
    onAfterPrint: () => {
      console.log('Impressão concluída');
    }
  });

  async function handleValidate() {
    if (!files.products || !files.shipments) {
      return;
    }

    const isValidProduct = await validateProducts.validate({
      listProducts: files.products,
      transports: files.shipments
    });
    const isValidRoutes = await validateRoutes.validate({
      transports: files.shipments,
      listRoutes: files.routes || null
    });

    if (!isValidProduct.valid || !isValidRoutes.valid) {
      setValidateProducts(isValidProduct);
      setValidateRoutes(isValidRoutes);
      setTab('validacao');
      return;
    }

    if (isValidProduct.valid) {
      return setTab('configuracao');
    }

    setValidateProducts(isValidProduct);
    setValidateRoutes(isValidRoutes);
    setTab('validacao');
  }

  async function handleGenerateMap() {
    if (!files.shipments || !files.products) {
      return;
    }
    const map = await generateMap.generateMap(config, files.shipments, files.products, files?.routes)
    const products = await convertShipment.convertProducts(files.products)
    setProductData(products)
    setMap(map)
    setMapData(map)
    setTab('mapa');
  }

  const [files, setFiles] = useState<FilesState>({
    products: null,
    routes: null,
    shipments: null
  });

  const convertShipment = new ConvertXlsx()

  useEffect(() => {
    if (files.shipments) {
      convertShipment.convertShipment(files.shipments).then(setShipment)
    }
  }, [files.shipments])

  const getTabIcon = (tabValue: string) => {
    switch (tabValue) {
      case 'upload': return <UploadIcon className="w-4 h-4" />;
      case 'validacao': return <CheckCircle className="w-4 h-4" />;
      case 'configuracao': return <Settings className="w-4 h-4" />;
      case 'mapa': return <FileText className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTabTitle = (tabValue: string) => {
    switch (tabValue) {
      case 'upload': return 'Upload de Arquivos';
      case 'validacao': return 'Validação de Dados';
      case 'configuracao': return 'Configuração do Mapa';
      case 'mapa': return 'Mapa Gerado';
      default: return '';
    }
  };

  const getTabDescription = (tabValue: string) => {
    switch (tabValue) {
      case 'upload': return 'Faça upload dos arquivos necessários para gerar o mapa de separação';
      case 'validacao': return 'Verifique se os dados estão corretos antes de prosseguir';
      case 'configuracao': return 'Configure os parâmetros do mapa de separação';
      case 'mapa': return 'Visualize e imprima o mapa de separação gerado';
      default: return '';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Mapa de Separação</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e configure seus mapas de separação
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {getTabTitle(tab)}
        </Badge>
      </div>

      <Separator />

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList hidden className="grid w-full grid-cols-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="validacao" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Validação</span>
          </TabsTrigger>
          <TabsTrigger value="configuracao" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configuração</span>
          </TabsTrigger>
          <TabsTrigger value="mapa" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Mapa</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTabIcon(tab)}
                {getTabTitle(tab)}
              </CardTitle>
              <CardDescription>
                {getTabDescription(tab)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadPage setFiles={setFiles} files={files} />
              <div className="flex justify-end pt-4">
                <Button onClick={handleValidate} disabled={!files.products || !files.shipments}>
                  Validar Arquivos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTabIcon(tab)}
                {getTabTitle(tab)}
              </CardTitle>
              <CardDescription>
                {getTabDescription(tab)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Validacao />
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setTab('upload')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Upload
                </Button>
                {validateProductsStore.valid && (
                  <Button onClick={() => setTab('configuracao')}>
                    Continuar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTabIcon(tab)}
                {getTabTitle(tab)}
              </CardTitle>
              <CardDescription>
                {getTabDescription(tab)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Configuracao config={config} setConfig={setConfigCompat} />
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setTab('upload')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Upload
                </Button>
                <Button onClick={handleGenerateMap}>
                  Gerar Mapa
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTabIcon(tab)}
                {getTabTitle(tab)}
              </CardTitle>
              <CardDescription>
                {getTabDescription(tab)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <PrintProtocol generateProtocol={generateProtocol} shipmentItems={shipment} />
                <Button
                  onClick={() => setTab('configuracao')}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reconfigurar
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex-1 print:hidden"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Mapa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Mapa</CardTitle>
              <CardDescription>
                Escolha o tipo de mapa que deseja visualizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={tipoMapa} 
                onValueChange={(value) => setTipoMapa(value as 'separacao' | 'carregamento')}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="separacao" id="mapa-separacao" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="mapa-separacao" className="cursor-pointer font-medium">
                        Mapa de Separação
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Para organizar a separação de produtos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="carregamento" id="mapa-carregamento" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-green-600" />
                      <Label htmlFor="mapa-carregamento" className="cursor-pointer font-medium">
                        Mapa de Carregamento
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Para organizar o carregamento de transportes
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Mapa Gerado */}
          <Card>
            <CardContent className="p-0">
              <div ref={componentRef} className="w-full">
                <PrintPage group={map} type={config.tipo} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}