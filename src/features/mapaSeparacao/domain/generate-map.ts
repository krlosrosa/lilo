import { ShipmentItem } from "../types/shipment-type";

export interface GenerateMap {
  generateMap(config: PropsConfig, shipmentItems: File, products: File, routerItems: File | null): Promise<GenerateMapResult>;
}

export type GenerateMapResult = any


export type Group = {
  id: string
  name: string
  items: string[] 
}


export type PropsConfig = {
  tipo: 'transport' | 'customerCode'
  transportes: Group[]
  segregedClients: string[]
  clientes: Group[]
  remessas: Group[]
  isRange: boolean
  minRange: number
  maxRange: number
  isPallet: boolean
  maxPallet: number
  isLine: boolean
  maxLine: number
  palletsFull: boolean
  unidadesSeparadas: boolean
  isSegregedFifo: boolean
  rangeFifo: string[]
  convertToPallet: boolean
}