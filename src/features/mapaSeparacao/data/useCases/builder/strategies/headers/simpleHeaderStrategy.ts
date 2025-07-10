import { RoutingItem } from "@/features/mapaSeparacao/types/routing-type";
import { HeaderStrategy } from "./type-headers";
import { customAlphabet } from "nanoid";

export class SimpleHeaderStrategy implements HeaderStrategy {
  constructor(private readonly type: string, private readonly router: RoutingItem[] | null) { }
  generateHeader(items: any[], groupKey: string) {
    // Verificar se items não está vazio
    const nanoidNumeric = customAlphabet('0123456789', 3);
    const id = nanoidNumeric()
    if (!items || items.length === 0) {
      return {
        group: groupKey,
        id: '',
        linhasPicking: 0,
        Caixas: 0,
        Unidades: 0,
        Pallets: 0,
        transporte: '',
        placa: '',
        perfilVeiculo: '',
        transportadora: '',
        codCliente: '',
        nomeCliente: '',
        sequencia: '',
        rota: '',
        local: '',
      };
    }

    const caixas = items.reduce((acc, item) => acc + (item.boxes || 0), 0);
    const unidades = items.reduce((acc, item) => acc + (item.units || 0), 0);
    const pallets = items.reduce((acc, item) => acc + (item.Pallets || 0), 0);
    const linhasPicking = items.length
    const info = items[0]
    const routerTransporte = this.router?.find(r => r.transport === info?.transport) 
    const routerVeiculo = this.router?.find(r => r.customer === info?.customerCode)

    return {
      group: groupKey,
      linhasPicking: linhasPicking,
      id: id,
      Caixas: caixas,
      Unidades: unidades,
      Pallets: pallets,
      transporte: info.transport, 
      placa: routerTransporte?.licensePlate || info.licensePlate, 
      perfilVeiculo: routerTransporte?.effectiveVehicle, 
      transportadora: routerTransporte?.carrier,
      codCliente: info.customerCode,
      nomeCliente: info.customerName,
      sequencia: routerVeiculo?.sequence || routerTransporte?.sequence,
      rota: routerTransporte?.route,
      local: routerTransporte?.location,
    };
  }
}