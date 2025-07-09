'use client'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataStore } from "@/features/mapaSeparacao/presentation/store/dataStore";
import { GenerateResupply } from "@/features/ressuprimento/domain/generate-resupply";
import { usePrintResupply } from "../print/usePrintResupply";
import { Package, Truck, RefreshCw, BarChart3, Printer } from "lucide-react";
import _ from "lodash";
import { useEffect, useState } from "react";

type Props = {
  generateResupply: GenerateResupply
}

export default function ListResuprimento({ generateResupply }: Props) {
  const { mapData, productData } = useDataStore();
  const [resupply, setResupply] = useState<GenerateResupply.Result>([]);

  const { componentRef, handlePrint } = usePrintResupply({
    onBeforePrint: () => {
      console.log('Preparando impressão...');
    },
    onAfterPrint: () => {
      console.log('Impressão concluída');
    }
  });

  useEffect(() => {
    handleGenerateResupply()
  }, [mapData])

  function handleGenerateResupply() {
    const resupply = generateResupply.generate(mapData)
    const sumarizar = _.chain(resupply)
      .groupBy('skuCode')
      .map((group, skuCode) => {
        const firstItem = group[0];
        return {
          skuCode: skuCode,
          skuDescription: firstItem.skuDescription,
          companyName: firstItem.companyName,
          boxes: _.sumBy(group, 'boxes')
        };
      })
      .value()

    const listProducts = sumarizar.map((item) => {
      const product = productData.find((product) => product.skuCode === item.skuCode)
      const palletsFull = Math.floor(item.boxes / (product?.boxesPerPallet || 0))

      return {
        ...item,
        palletsFull: palletsFull
      }
    })
    setResupply(_.sortBy(_.filter(listProducts, (item) => item.palletsFull > 0), 'skuDescription'))
  }

  const totalPallets = _.sumBy(resupply, 'palletsFull');
  const totalBoxes = _.sumBy(resupply, 'boxes');

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between no-print">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Resuprimento</h1>
          <p className="text-muted-foreground">
            Gerencie o resuprimento de produtos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateResupply} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <div ref={componentRef}>
        {/* Print Header - Only visible when printing */}
        <div className="print-header" style={{ display: 'none' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
            Lista de Resuprimento
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Gerado em: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 mb-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resupply.length}</div>
              <p className="text-xs text-muted-foreground">
                Produtos únicos que precisam ser ressupridos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Boxes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBoxes}</div>
              <p className="text-xs text-muted-foreground">
                Caixas a serem ressupridas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pallets</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPallets}</div>
              <p className="text-xs text-muted-foreground">
                Paletes completos necessários
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Print Summary - Only visible when printing */}
        <div className="print-summary" style={{ display: 'none' }}>
          <div>
            <strong>Total Items:</strong> {resupply.length}
          </div>
          <div>
            <strong>Total Boxes:</strong> {totalBoxes}
          </div>
          <div>
            <strong>Total Pallets:</strong> {totalPallets}
          </div>
        </div>

        {/* Data Table */}
        <Card className="print-table">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Itens de Resuprimento
            </CardTitle>
            <CardDescription>
              Lista de produtos que precisam ser ressupridos com quantidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold py-2 px-3 w-auto">SKU</TableHead>
                    <TableHead className="font-semibold py-2 px-3 w-auto">Description</TableHead>
                    <TableHead className="font-semibold py-2 px-3 w-auto">Company</TableHead>
                    <TableHead className="font-semibold text-right py-2 px-3 w-auto">Boxes</TableHead>
                    <TableHead className="font-semibold text-right py-2 px-3 w-auto">Pallets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resupply.map((item: any, index: number) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium py-1 px-3 text-xs w-auto whitespace-nowrap">{item.skuCode}</TableCell>
                      <TableCell className="py-1 px-3 text-xs w-auto">{item.skuDescription}</TableCell>
                      <TableCell className="py-1 px-3 text-xs w-auto whitespace-nowrap">{item.companyName}</TableCell>
                      <TableCell className="text-right font-medium py-1 px-3 text-xs w-auto whitespace-nowrap">{item.boxes}</TableCell>
                      <TableCell className="text-right py-1 px-3 w-auto">
                        <Badge variant="secondary" className="font-semibold text-xs px-2 py-0">
                          {item.palletsFull}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}