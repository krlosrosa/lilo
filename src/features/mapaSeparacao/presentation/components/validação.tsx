import { AlertTriangle, XCircle, Info, Package, Truck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDataStore } from "../store/dataStore";

export default function Validacao() {
  const { validateProducts, validateRoutes } = useDataStore();

  const hasErrors = !validateProducts.valid || !validateRoutes.valid;

  if (!hasErrors) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Alertas lado a lado */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Erros Obrigatórios - Produtos */}
        {!validateProducts.valid && (
          <div className="flex-1">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Produtos não Cadastrados
                </div>
                <Badge variant="destructive" className="text-xs">
                  {validateProducts.transports?.length || 0}
                </Badge>
              </AlertTitle>
              <AlertDescription className="mt-3">
                <p className="text-sm opacity-90 mb-3">
                  {validateProducts.message}
                </p>
                
                {validateProducts.transports && validateProducts.transports.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {validateProducts.transports.map((transport, index) => (
                      <div
                        key={`${transport.skuCode}-${index}`}
                        className="flex items-center justify-between p-2 bg-destructive/10 rounded border border-destructive/20"
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium truncate">
                            {transport.skuCode}
                          </span>
                          {transport.skuDescription && (
                            <span className="text-xs opacity-75 truncate">
                              {transport.skuDescription}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs ml-2 border-destructive/30">
                          Obrigatório
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Erros Informativos - Transportes */}
        {!validateRoutes.valid && (
          <div className="flex-1">
            <Alert variant="default" className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
              <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertTitle className="flex items-center justify-between text-orange-800 dark:text-orange-200">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Transportes não Encontrados
                </div>
                <Badge variant="outline" className="text-xs text-orange-700 dark:text-orange-300 border-orange-500/40">
                  {validateRoutes.transports?.length || 0}
                </Badge>
              </AlertTitle>
              <AlertDescription className="mt-3">
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  {validateRoutes.message}
                </p>
                
                {validateRoutes.transports && validateRoutes.transports.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {validateRoutes.transports.map((transport, index) => (
                      <div
                        key={`${transport.transport}-${index}`}
                        className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800"
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium text-orange-900 dark:text-orange-100 truncate">
                            {transport.transport}
                          </span>
                          {transport.licensePlate && (
                            <span className="text-xs text-orange-600 dark:text-orange-400 truncate">
                              Placa: {transport.licensePlate}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-600 ml-2">
                          Informativo
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Resumo Compacto */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Status da Validação
            </h3>
            <div className="flex items-center gap-3">
              {!validateProducts.valid && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {validateProducts.transports?.length || 0} obrigatório(s)
                  </span>
                </div>
              )}
              {!validateRoutes.valid && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <Info className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {validateRoutes.transports?.length || 0} informativo(s)
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}