import { SummarizeStrategy } from "./sumary-type";

export class SumByItemAndLoteStrategy implements SummarizeStrategy {
  summarize(data: any[]): any[] {
    // Agrupa por item e lote, somando a quantidade
    const summaryMap = new Map<string, any>();

    data.forEach((item) => {
      const key = `${item.skuCode}|${item.batch}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, { ...item, boxes: 0, units: 0 });
      }
      summaryMap.get(key).boxes += item.boxes;
      summaryMap.get(key).units += item.units;
    });

    return Array.from(summaryMap.values());
  }
}