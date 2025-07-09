import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";
import { Group } from "@/features/mapaSeparacao/domain/generate-map";

export class GroupByClient implements GroupStrategy {
  constructor(private readonly grupos: Group[]) { }

  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => {
      const grupo = this.grupos.find(grupo => grupo.items.includes(item.customerCode))
      if (grupo) {
        return `[${item.transport}]-${grupo.name}`
      }
      return `[${item.transport}]-${item.customerCode}`
     });
  }
}
