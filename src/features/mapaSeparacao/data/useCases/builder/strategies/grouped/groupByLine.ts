import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";

export class GroupByLine	 implements GroupStrategy {
  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => { return `segmento:${item.line}` });
  }
}
