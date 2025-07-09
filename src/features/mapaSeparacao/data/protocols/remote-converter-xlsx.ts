import { ProductsItem } from "../../types/product-types"
import { RoutingItem } from "../../types/routing-type"
import { ShipmentItem } from "../../types/shipment-type"

export interface RemoteConverterXlsx {
  convertShipment(params: File): Promise<ShipmentItem[]>
  convertRouting(params: File): Promise<RoutingItem[]>
  convertProducts(params: File): Promise<ProductsItem[]>
}