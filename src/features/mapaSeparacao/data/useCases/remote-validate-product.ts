import _ from "lodash";
import { ValidateTransportResult, ValidateTransportType } from "../../domain/validateTransport";
import { RemoteConverterXlsx } from "../protocols/remote-converter-xlsx";
import { ValidateProducts, ValidateProductsResult, ValidateProductsType } from "../../domain/validateProducts";

export class RemoteValidateProducts implements ValidateProducts {
  constructor(  
    private readonly convertShipment: RemoteConverterXlsx,
    private readonly convertProduct: RemoteConverterXlsx
  ) { }

  async validate(params: ValidateProductsType): Promise<ValidateProductsResult> {
    const { transports, listProducts } = params;
    const shipment = await this.convertShipment.convertShipment(transports!)
    const products = await this.convertProduct.convertProducts(listProducts!)
    const uniqueShipments = _.uniqBy(shipment, 'skuCode');
    const uniqueProducts = _.uniqBy(products, 'skuCode');
    const validProducts = _.differenceWith(uniqueShipments, uniqueProducts, (transport, product) =>
      transport.skuCode === product.skuCode
    );

    if (validProducts.length > 0) {
      return { valid: false, message: 'Produtos inválidos', transports: validProducts };
    }
    return {
      valid: true,
    };
  }
}
  