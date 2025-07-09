import _ from "lodash";
import { ValidateTransport, ValidateTransportResult, ValidateTransportType } from "../../domain/validateTransport";
import { RemoteConverterXlsx } from "../protocols/remote-converter-xlsx";

export class RemoteValidateTransport implements ValidateTransport {
  constructor(
    private readonly convertShipment: RemoteConverterXlsx,
    private readonly convertRouting: RemoteConverterXlsx
  ) { }

  async validate(params: ValidateTransportType): Promise<ValidateTransportResult> {
    const { transports, listRoutes } = params;
    const shipment = await this.convertShipment.convertShipment(transports!)
    const routing = await this.convertRouting.convertRouting(listRoutes!)
    
    // Retorna apenas transportes únicos baseados no número do transport
    const uniqueShipments = _.uniqBy(shipment, 'transport');
    const uniqueRoutings = _.uniqBy(routing, 'transport');
    
    const validTransports = _.differenceWith(uniqueShipments, uniqueRoutings, (transport, route) =>
      transport.transport === route.transport
    );

    if (validTransports.length > 0) {
      return { valid: false, message: 'Transportes inválidos', transports: validTransports };
    }
    return {
      valid: true,
    };
  }
}
