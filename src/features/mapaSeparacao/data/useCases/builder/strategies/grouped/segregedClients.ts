import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";

export class GroupBySegregedClients implements GroupStrategy {
  constructor(private readonly listClients: string[]) { }

  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => {
      if (this.listClients.includes(item.customerCode)) {
        return `segregado-${item.customerCode}`
      }
      return 'outros'
    });
  }
}