'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dispatch, SetStateAction, useState } from "react";
import { FilesState } from "../pages/mapaSeparacao";
import { Upload, FileText, Package, Truck, CheckCircle, X } from "lucide-react";

type Props = {
  setFiles: Dispatch<SetStateAction<FilesState>>
  files: FilesState
}

const CompactFileUpload = ({ 
  id, 
  title, 
  icon: Icon, 
  file, 
  onChange, 
  required = false 
}: {
  id: keyof FilesState;
  title: string;
  icon: any;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      const mockEvent = {
        target: { files: [droppedFile] },
        currentTarget: { files: [droppedFile] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(mockEvent);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mockEvent = {
      target: { files: [] },
      currentTarget: { files: [] }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange(mockEvent);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm font-medium">
          {title}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : file 
              ? 'border-green-300 bg-green-50/50' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type="file"
          accept=".xlsx, .xls"
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs font-medium text-green-700 truncate">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Clique ou arraste arquivo</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function UploadPage({ setFiles, files }: Props) {
  const handleFileChange = (fileType: keyof FilesState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const uploadedCount = Object.values(files).filter(Boolean).length;
  const isComplete = files.products && files.shipments;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header compacto */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Upload de Arquivos</h3>
              <p className="text-xs text-muted-foreground">
                {uploadedCount}/3 arquivos • {isComplete ? "Pronto para validar" : "Arquivos obrigatórios pendentes"}
              </p>
            </div>
            {isComplete && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Completo</span>
              </div>
            )}
          </div>

          {/* Upload grid compacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CompactFileUpload
              id="products"
              title="Produtos"
              icon={Package}
              file={files.products}
              onChange={handleFileChange('products')}
              required={true}
            />

            <CompactFileUpload
              id="shipments"
              title="Remessas"
              icon={Truck}
              file={files.shipments}
              onChange={handleFileChange('shipments')}
              required={true}
            />

            <CompactFileUpload
              id="routes"
              title="Rotas"
              icon={FileText}
              file={files.routes}
              onChange={handleFileChange('routes')}
              required={false}
            />
          </div>

          {/* Info compacta */}
          <div className="text-xs text-muted-foreground text-center">
            Formatos suportados: .xlsx, .xls
          </div>
        </div>
      </CardContent>
    </Card>
  )
}