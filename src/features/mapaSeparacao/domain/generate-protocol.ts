import { ShipmentItem } from "../types/shipment-type";

export interface GenerateProtocol {
  generateProtocol(params: GenerateProtocolParams): Promise<GenerateProtocolResult[]>;
}

export type GenerateProtocolParams = {
  shipmentItems: ShipmentItem[]
}

export type GenerateProtocolResult = {
  transport: string
  pesoBruto: number
  pesoLiquido: number
  totalClients: number
}
