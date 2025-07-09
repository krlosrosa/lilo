import { SplitStrategy } from "./type-split";

export class SplitPalletAndUnits implements SplitStrategy {
  split(data: any[]): any[] {
    const result: any[] = [];

    data.forEach(item => {
      if (item.Pallets && item.Pallets > 0) {
        result.push({
          ...item,
          Pallets: item.Pallets,
          units: 0,
          boxes:0
        });
      }
      if (item.units && item.units > 0) {
        result.push({
          ...item,
          units: item.units,
          boxes:0,
          Pallets: 0
        });
      }
      if (item.boxes && item.boxes > 0) {
        result.push({
          ...item,
          units: 0,
          boxes: item.boxes,
          Pallets: 0
        });
      }
      // Se não tem pallet nem unidade, pode ignorar ou tratar conforme sua regra
    });

    return result;
  }
}
