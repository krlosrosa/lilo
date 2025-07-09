import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";

export class GroupByType implements GroupStrategy {
  constructor(private readonly tipo: "transport" | "customerCode") { }
  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => {
      return this.tipo === "transport" ? item.transport : `${item.customerCode}-[${item.transport}]`; 
    });
  }
}
