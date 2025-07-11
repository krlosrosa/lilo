import _ from "lodash";
import { GenerateProtocol, GenerateProtocolParams, GenerateProtocolResult } from "../../domain/generate-protocol";
import { ShipmentItem } from "../../types/shipment-type";
import { RemoteConverterXlsx } from "../protocols/remote-converter-xlsx";

export class RemoteGenerateProtocol implements GenerateProtocol {

  async generateProtocol(params: GenerateProtocolParams): Promise<GenerateProtocolResult[]> {

    // agrupar por transporte somar totais caixas, peso contar clientes unicos e peso
    const groupedByTransport = _.groupBy(params.shipmentItems, 'transport')
    const transportes = Object.keys(groupedByTransport)
    const result = transportes.map(transport => {
      const items = groupedByTransport[transport]
      const pesoLiquido = items.reduce((acc, item) => acc + item.netWeight, 0)
      const pesoBruto = items.reduce((acc, item) => acc + item.grossWeight, 0)
      const uniqueClients = _.uniqBy(items, 'customerCode')
      const totalClients = uniqueClients.length
      return {
        transport,
        pesoBruto,
        pesoLiquido,
        totalClients,
      }
    })
    return result
  }
}

