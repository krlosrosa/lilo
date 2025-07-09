import { processExcelFile } from "../../infra/convertXlsx";

export interface ClienteSegregado {
  codCliente: string
}

export async function convertFileToClientesSegregados(file: File): Promise<ClienteSegregado[]> {
  console.log("convertFileToClientesSegregados called with file:", file);
  
  try {
    const data: any[] = await processExcelFile(file) as any[];
    console.log("Excel data processed:", data);
    
    const convertedData = data.map((item: any) => {
      // Tenta diferentes possíveis nomes de coluna
      const codCliente = 
        item["Código do Cliente"] || 
        item["Código Cliente"] || 
        item["CodCliente"] || 
        item["Cliente"] || 
        item["Código"] ||
        item["Codigo"] ||
        Object.values(item)[0] // Pega o primeiro valor se não encontrar coluna específica
      
      return {
        codCliente: String(parseNumberBr(codCliente)).replace(/^0+/, "") // Remove zeros à esquerda
      }
    }).filter(cliente => cliente.codCliente && cliente.codCliente !== "") // Remove valores vazios

    console.log("Converted data:", convertedData);
    return convertedData;
  } catch (error) {
    console.error("Error in convertFileToClientesSegregados:", error);
    throw error;
  }
} 

export function parseNumberBr(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(value.replace(/\./g, ",").replace(",", "."));
}