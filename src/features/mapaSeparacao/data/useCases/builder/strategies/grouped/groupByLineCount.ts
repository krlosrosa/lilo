import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";
import { GroupedResult, GroupStrategy } from "../../component-interface";

export class GroupByLineCount implements GroupStrategy {
  constructor(private readonly config: PropsConfig, private readonly limit: number = 10) {}

  group(data: any[]): GroupedResult {
    let lineCount = 0;
    let groupIndex = 1;
    const result: GroupedResult = {};
    let currentGroup: any[] = [];
    const noBoxes: any[] = [];

    for (const item of data) {
      if (this.config.isSegregedFifo && this.config.rangeFifo.includes(item.belt)) {
        noBoxes.push(item);
        continue;
      }
      if(this.config.palletsFull){
        if(item.Pallets > 0){
          noBoxes.push(item);
          continue;
        }
      }
      if (!(item.boxes > 0)) {
        noBoxes.push(item);
        continue;
      }
      if (lineCount >= this.limit && currentGroup.length > 0) {
        result[`Group:${groupIndex}`] = currentGroup;
        groupIndex++;
        currentGroup = [];
        lineCount = 0;
      }
      currentGroup.push(item);
      lineCount++;
    }

    if (currentGroup.length > 0) {
      result[`Group:${groupIndex}`] = currentGroup;
    }
    if (noBoxes.length > 0) {
      result["NoBoxes"] = noBoxes;
    }

    return result;
  }
}