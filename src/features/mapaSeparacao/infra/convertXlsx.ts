import { RemoteConverterXlsx } from "../data/protocols/remote-converter-xlsx";
import { ProductsItem } from "../types/product-types";
import { RoutingItem } from "../types/routing-type";
import { ShipmentItem } from "../types/shipment-type";
import * as XLSX from "xlsx";

export class ConvertXlsx implements RemoteConverterXlsx {

  async convertShipment(params: File): Promise<ShipmentItem[]> {
    const data: any[] = await processExcelFile(params) as any[];
    const convertedData = data.map((item: any) => ({
      transport: String(item["Nº transporte(DT)"] ?? "").trim().replace(/^0+/, ""),
      shipment: String(item["Remessa"] ?? "").trim().replace(/^0+/, ""),
      shipmentItem: String(item["Nº item remessa"] ?? "").trim(),
      center: String(item["Centro"] ?? "").trim(),
      company: String(item["Empresa"] ?? "").trim(),
      companyName: String(item["Nome Empresa"] ?? "").trim(),
      licensePlate: String(item["Placa"] ?? "").trim(),
      skuCode: String(item["Cód. Item"] ?? "").trim(),
      skuDescription: String(item["Descrição do produto"] ?? "").trim(),
      batch: String(item["Lote"] ?? "").trim(),
      sale: parseFloat(item["Total(Unid.Vda.)"]) || 0,
      averageUnit: String(item["Unid.Armaz."] ?? "").trim(),
      manufacturingDate: new Date(item["Dt.Fabricação"]),
      expirationDate: new Date(item["Dt.Vencimento"]),
      customerCode: String(item["Cód. Cliente"] ?? "").trim().replace(/^0+/, ""),
      customerName: String(item["Nome Cliente"] ?? "").trim(),
      grossWeight: parseFloat(item["Peso Bruto"]) || 0,
      netWeight: parseFloat(item["Peso Líquido"]) || 0,
    }));

    return convertedData;
  }
  async convertRouting(params: File): Promise<RoutingItem[]> {
    if (!params) {
      return [];
    }
    const data: any[] = await processExcelFile(params) as any[];
  
    const convertedData = data.map((item: any) => ({
      company: String(item["Empresa"] ?? "").trim(),
      route: String(item["Rota Gerada no Roteirizador"] ?? "").trim(),
      transport: String(item["Nº transporte"] ?? "").trim(),
      licensePlate: String(item["Identif.externo 1"] ?? "").trim(),
      shipmentRoute: String(item["Fornecimento"] ?? "").trim().replace(/^0+/, ""),
      sequence: parseInt(item["Seqüência"]) || 0,
      customer: String(item["Cliente"] ?? "").trim().replace(/^0+/, ""),
      customerName: String(item["Nome"] ?? "").trim(),
      location: String(item["Local"] ?? "").trim(),
      routedVehicle: String(item["Veículo Roteirizado"] ?? "").trim(),
      effectiveVehicle: String(item["Veículo Efetivo"] ?? "").trim(),
      carrier: String(item["Nome do Transportador"] ?? "").trim(),
      cargoType: String(item["Tipo de Carga"] ?? "").trim(),
    }));
  
    return convertedData;
  }

  async convertProducts(params: File): Promise<ProductsItem[]> {
    const data: any[] = await processExcelFile(params) as any[];
    const convertedData = data.map((item: any) => ({
      skuCode: String(item["Cod_SKU"] ?? "").trim(),
      skuDescription: String(item["Descricao_SKU"] ?? "").trim(),
      shelf: parseInt(item["Shelf_Life"]) || 0,
      weightType: parseInt(item["Tipo_Peso"]) || 0,
      boxWeight: parseNumberBr(item["Peso_Liq(cx)"]),
      unitsPerBox: parseInt(item["Un_Cx"]) || 0,
      boxesPerPallet: parseInt(item["Cx_Pallet"]) || 0,
      line: String(item["Linha"] ?? "").trim(),
      redRange: parseNumberBr(item["Vermelho"]),
      orangeRange: parseNumberBr(item["Laranja"]),
      yellowRange: parseNumberBr(item["Amarelo"]),
      greenRange: parseNumberBr(item["Verde"]),
      pickWay: parseInt(item["PickWay"]) || 0,
      address: String(item["Endereço"] ?? "").trim(),
      empresa: String(item["Empresa"] ?? "").trim(),
    }))
  
    return convertedData;
  }
}

export function parseNumberBr(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(value.replace(/\./g, ",").replace(",", "."));
}

export async function processExcelFile(
  file: File
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        }) as any[];

        return resolve(jsonData);
      } catch (error) {
        console.error(error);
        reject(new Error("Erro ao processar o arquivo Excel"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };

    reader.readAsArrayBuffer(file);
  });
}