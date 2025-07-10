import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";
import { GroupedResult, GroupStrategy } from "../../component-interface";

export class GroupByPalletPercentage implements GroupStrategy {
  constructor(private readonly config: PropsConfig, private readonly limit: number = 100) { }

  group(data: any[]): GroupedResult {
    let currentSum = 0;
    let groupIndex = 1;
    const result: GroupedResult = {};
    let currentGroup: any[] = [];
    const noBoxes: any[] = [];

    for (const item of data) {
      if (item.boxes === 0 && item.units === 0 && this.config.palletsFull) {
        noBoxes.push(item);
        continue;
      }

      if (item.boxes === 0 && this.config.unidadesSeparadas) {
        noBoxes.push(item);
        continue;
      }
      
      if (this.config.isSegregedFifo && this.config.rangeFifo.includes(item.belt)) {
        noBoxes.push(item);
        continue;
      }
      if (this.config.palletsFull) {
        if (item.Pallets > 0) {
          noBoxes.push(item);
          continue;
        }
      }
      const percent = Number(item.percentPallet) || 0;
      if (currentSum + percent > this.limit && currentGroup.length > 0 && item.boxes > 0) {
        result[`Group:${groupIndex}`] = currentGroup;
        groupIndex++;
        currentGroup = [];
        currentSum = 0;
      }
      currentGroup.push(item);
      currentSum += percent;
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