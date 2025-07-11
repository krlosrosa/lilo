"use client"
import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { GenerateProtocol, GenerateProtocolResult } from "../../domain/generate-protocol";
import { ShipmentItem } from "../../types/shipment-type";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ListCheck, Package } from "lucide-react";

type Props = {
  generateProtocol: GenerateProtocol
  shipmentItems: ShipmentItem[]
}

export default function PrintProtocol({ generateProtocol, shipmentItems }: Props) {
  const [protocol, setProtocol] = useState<GenerateProtocolResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()

  useEffect(() => {
    generateProtocol.generateProtocol({ shipmentItems }).then(setProtocol)
  }, [shipmentItems])

  // Função para formatar números no padrão brasileiro
  const formatNumber = (value: number, decimals: number = 2): string => {
    if (isNaN(value) || !isFinite(value)) return '0,00'

    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }

  // Função para formatar peso em kg
  const formatWeight = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) return '0,00 kg'
    return `${formatNumber(value, 2)} kg`
  }

  // Função para formatar data no padrão brasileiro
  const formatDate = (): string => {
    const now = new Date()
    return now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Função para formatar hora no padrão brasileiro
  const formatTime = (): string => {
    const now = new Date()
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Protocolo de separação - ${formatDate()}`,
    pageStyle: `
     @page {
      size: A4;
      margin-top: 0mm;
      margin-bottom: 20mm;
      margin-left: 5mm;
      margin-right: 5mm;

      /* Força o conteúdo das áreas de cabeçalho a ser vazio, removendo o padrão do navegador */
      @top-center { content: ""; }
      @top-left { 
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #71717a; /* zinc-500 */
      }
      @top-right { content: ""; }

      @bottom-right {
        content: "Página " counter(page) " de " counter(pages);
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #71717a; /* zinc-500 */
      }
      @bottom-left {
        content: "Impresso em: ${new Date().toLocaleString('pt-BR')} - impressão por ${session?.user?.name} ";
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #71717a; /* zinc-500 */
      }
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
      .print-page-break {
        page-break-before: always !important;
      }
    }
  `
  })

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        variant="outline"
        className="flex-1"
      >
        <ListCheck className="w-4 h-4 mr-2" />
        Protocolo
      </Button>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-6xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Protocolo de Impressão</h2>
              <p className="text-sm text-gray-600">Resumo do protocolo de separação gerado</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content - Área com scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(90vh - 160px)' }}>
            {/* Conteúdo para impressão */}
            <div ref={componentRef} className="">
              {/* Cabeçalho do Protocolo */}
              <div className="mb-4 ">
                <h2 className="text-lg font-bold text-center mb-1 ">PROTOCOLO DE SEPARAÇÃO</h2>
                <div className="text-center text-xs text-gray-600 ">
                  <p>Data: {formatDate()} - Hora: {formatTime()}</p>
                </div>
              </div>

              {/* Resumo Geral - Layout Compacto */}
              {protocol.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-gray-900 border-b border-gray-300 pb-1">Resumo Geral</h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Total de Transportes:</span>
                      <span className="font-semibold">{formatNumber(protocol.length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso Bruto Total:</span>
                      <span className="font-semibold">{formatWeight(protocol.reduce((sum, item) => sum + item.pesoBruto, 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso Líquido Total:</span>
                      <span className="font-semibold">{formatWeight(protocol.reduce((sum, item) => sum + item.pesoLiquido, 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Clientes:</span>
                      <span className="font-semibold">{formatNumber(protocol.reduce((sum, item) => sum + item.totalClients, 0), 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Separador visual */}
              <div className="border-t border-gray-300 my-4 "></div>

              {/* Tabela do Protocolo */}
              <div className="mb-4 ">
                <div className="overflow-x-auto border border-gray-300">
                  <table className="w-full border-collapse text-[10px] ">
                    <thead className="sticky top-0 bg-gray-50 ">
                      <tr>
                        <th className="border-b border-gray-300 px-2 text-center font-bold text-gray-700">Transporte</th>
                        <th className="border-b border-gray-300 px-2 text-center font-bold text-gray-700">Peso Bruto (kg)</th>
                        <th className="border-b border-gray-300 px-2 text-center font-bold text-gray-700">Peso Líquido (kg)</th>
                        <th className="border-b border-gray-300 px-2 text-center font-bold text-gray-700">Total de Clientes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {protocol.map((item, index) => (
                        <tr key={index} className="p-0 border">
                          <td className="px-2 text-center font-medium text-gray-900 transport-col">{item.transport}</td>
                          <td className="px-2 text-center text-gray-700 numeric-col">{formatWeight(item.pesoBruto)}</td>
                          <td className="px-2 text-center text-gray-700 numeric-col">{formatWeight(item.pesoLiquido)}</td>
                          <td className="px-2 text-center text-gray-700 numeric-col">{formatNumber(item.totalClients, 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Sempre visível */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 shrink-0 rounded-b-xl">
            <Button onClick={handleClose} variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
              Fechar
            </Button>
            <Button onClick={handlePrint} className="ml-4 shadow-sm hover:shadow-md transition-shadow">
              Imprimir Protocolo
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}