import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";

export class GroupByCompany	 implements GroupStrategy {
  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => { return `empresa:${item.empresa}` });
  }
}
