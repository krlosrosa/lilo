'use client'
import { create } from "zustand";

import { ProductsItem } from "../../types/product-types";
import { RoutingItem } from "../../types/routing-type";
import { ShipmentItem } from "../../types/shipment-type";
import { ValidateProductsResult } from "../../domain/validateProducts";
import { ValidateTransportResult } from "../../domain/validateTransport";

type DataStore = {
  routingData: RoutingItem[];
  setRoutingData: (data: RoutingItem[]) => void;
  productData: ProductsItem[];
  setProductData: (data: ProductsItem[]) => void;
  shipmentData: ShipmentItem[];
  setShipmentData: (data: ShipmentItem[]) => void;
  validateProducts: ValidateProductsResult;
  setValidateProducts: (data: ValidateProductsResult) => void;
  validateRoutes: ValidateTransportResult;
  setValidateRoutes: (data: ValidateTransportResult) => void;
  mapData: any[];
  setMapData: (data: any[]) => void;
};

export const useDataStore = create<DataStore>((set) => ({
  routingData: [],
  setRoutingData: (data) => set({ routingData: data }),
  productData: [],
  setProductData: (data) => set({ productData: data }),
  shipmentData: [],
  setShipmentData: (data) => set({ shipmentData: data }),
  validateProducts: {
    valid: false,
    message: '',
    transports: []
  },
  setValidateProducts: (data) => set({ validateProducts: data }),
  validateRoutes: {
    valid: false,
    message: '',
    transports: []
  },
  setValidateRoutes: (data) => set({ validateRoutes: data }),
  mapData: [],
  setMapData: (data) => set({ mapData: data }),
})); 