import { TransformStrategy } from "./type-transform";

export class ConvertBoxToPallets implements TransformStrategy {
  transform(item: any) {
    const pallets = Math.floor(item.boxes / item.boxesPerPallet);
    const remainingBoxes = (item.boxes % item.boxesPerPallet); 
    const percentPallet = (remainingBoxes / item.boxesPerPallet) * 100;
    return { ...item, Pallets: pallets, boxes: remainingBoxes, percentPallet: percentPallet };
  }
}