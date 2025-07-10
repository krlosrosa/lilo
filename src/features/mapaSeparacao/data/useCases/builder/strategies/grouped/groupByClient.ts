import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";
import { Group } from "@/features/mapaSeparacao/domain/generate-map";

export class GroupByClient implements GroupStrategy {
  constructor(private readonly grupos: Group[]) { }

  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => {
      const grupo = this.grupos?.find(g => g.items.includes(item.customerCode));
      if (!grupo) {
        return `[${item.transport}]-${item.customerName}`;
      }
      return `[${item.transport}]-${grupo.name}`;
     });
  }
}
