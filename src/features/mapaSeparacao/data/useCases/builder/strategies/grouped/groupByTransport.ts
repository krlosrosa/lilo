import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";
import { Group } from "@/features/mapaSeparacao/domain/generate-map";

export class GroupByTransport implements GroupStrategy {
  constructor(
    private readonly remessas: Group[],
    private readonly transportes: Group[],
    private readonly segreged: string[],
  ) { }

  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => {
      const grupoTransporte = this.transportes.find(grupo => grupo.items.includes(item.transport))
      const segregado = this.segreged.includes(item.customerCode)
      const grupoRemessa = this.remessas.find(grupo => grupo.items.includes(item.shipment))
      console.log({item})
      if (grupoRemessa) {      
        console.log({grupoRemessa})
        return `transporte:${item.transport}[grupo-${grupoRemessa.name}]:remessa`
      }

      if (grupoTransporte) {
        return `transporte:${item.transport}[grupo-${grupoTransporte.name}]`
      }
      if (segregado) {
        return `transporte:${item.transport}[segregado-${item.customerCode}]`
      }
      return `transporte:${item.transport}`
    });
  }
}
