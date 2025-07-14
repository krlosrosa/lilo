import { TransformStrategy } from "./type-transform";

export class MapSaleToBoxesAndUnits implements TransformStrategy {
  transform(item: any) {
    if (item.averageUnit === "UN" || item.averageUnit === "CJ" || item.averageUnit === "PC" ) {
      return { ...item, units: item.sale, boxes: 0, sale: 0 };
    } else {
      return {...item, units: 0, boxes: item.sale, sale: 0 };
    }
  }
}