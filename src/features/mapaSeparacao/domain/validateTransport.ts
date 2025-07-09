import { ShipmentItem } from "../types/shipment-type";

export interface ValidateTransport {
  validate(params: ValidateTransportType): Promise<ValidateTransportResult>;
}

export type ValidateTransportType = {
  transports: File;
  listRoutes: File | null;
}

export type ValidateTransportResult = {
  valid: boolean;
  message?: string;
  transports?: ShipmentItem[];
}