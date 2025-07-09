"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useConfigPrintStore } from "../../../store/configPrint"
import { convertFileToClientesSegregados } from "../../../utils/functExcel"
import { produce } from "immer"


interface UploadClientesSegregadosProps {
  onUploadComplete?: (clientes: string[]) => void
}

export function UploadClientesSegregados({ onUploadComplete }: UploadClientesSegregadosProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { setConfigCompat } = useConfigPrintStore()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return

    setIsLoading(true)
    setError(null)

    try {
      const clientes = await convertFileToClientesSegregados(uploadedFile)
      const codigosClientes = clientes.map(cliente => cliente.codCliente)
      
      // Atualiza o store com os novos clientes
      setConfigCompat(produce((draft) => {
        draft.segregedClients = codigosClientes
      }))
      
      // Chama callback se fornecido
      if (onUploadComplete) {
        onUploadComplete(codigosClientes)
      }

      // Limpa o arquivo após upload bem-sucedido
      setUploadedFile(null)
      
      // Limpa o input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    setError(null)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
            className="w-full h-9"
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar arquivo Excel
          </Button>
        </div>
        {uploadedFile && (
          <Button
            onClick={handleUpload}
            disabled={isLoading}
            size="sm"
            className="h-9"
          >
            {isLoading ? "Processando..." : "Cadastrar"}
          </Button>
        )}
      </div>

      {uploadedFile && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{uploadedFile.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFile}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground">
        <p>• O arquivo deve conter uma coluna com os códigos dos clientes</p>
        <p>• Formatos aceitos: .xlsx, .xls</p>
        <p>• Nomes de coluna aceitos: "Código do Cliente", "Código Cliente", "CodCliente", "Cliente", "Código"</p>
      </div>
    </div>
  )
} 