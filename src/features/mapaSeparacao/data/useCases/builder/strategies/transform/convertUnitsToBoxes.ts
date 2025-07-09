import { TransformStrategy } from "./type-transform";

export class ConvertUnitsToBoxes implements TransformStrategy {
  transform(item: any) {
    const box = Math.floor(item.units / item.unitsPerBox);
    const remainingUnits = (item.units % item.unitsPerBox); 
    return { ...item, boxes: box + item.boxes, units: remainingUnits, qtdCaixa: item.unitsPerBox, qtdUnidade: item.units };
  }
}