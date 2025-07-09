import { ShipmentItem } from "../types/shipment-type";

export interface ValidateProducts {
  validate(params: ValidateProductsType): Promise<ValidateProductsResult>;
}

export type ValidateProductsType = {
  transports: File;
  listProducts: File;
}

export type ValidateProductsResult = {
  valid: boolean;
  message?: string;
  transports?: ShipmentItem[];
}