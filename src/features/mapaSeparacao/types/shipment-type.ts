export interface ShipmentItem {
  transport: string;
  shipment: string;
  shipmentItem: string;
  center: string;
  company: string;
  companyName: string;
  licensePlate: string;
  skuCode: string;
  skuDescription: string;
  batch: string;
  sale: number;
  averageUnit: string;
  manufacturingDate: Date;
  expirationDate: Date;
  customerCode: string;
  customerName: string;
  grossWeight: number;
  netWeight: number;
}