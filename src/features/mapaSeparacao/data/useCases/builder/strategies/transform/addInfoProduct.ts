import { ProductsItem } from "@/features/mapaSeparacao/types/product-types";
import { TransformStrategy } from "./type-transform";

export class AddInfoProduct implements TransformStrategy {
  constructor(private readonly products: ProductsItem[]) { }
  transform(item: any) {
    const product = this.products.find(p => p.skuCode === item.skuCode);
    return { ...item, ...product };
  }
}