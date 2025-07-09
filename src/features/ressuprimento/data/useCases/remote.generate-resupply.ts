import { RemoteConverterXlsx } from "@/features/mapaSeparacao/data/protocols/remote-converter-xlsx";
import { GenerateResupply } from "../../domain/generate-resupply";

export class RemoteGenerateResupply implements GenerateResupply {

  generate(data: GenerateResupply.Params): GenerateResupply.Result {
    let allItems: any[] = [];

    if (Array.isArray(data)) {
      allItems = allItems.concat(data);
    } else if (typeof data === 'object' && data !== null) {
      if (data.hasOwnProperty('items') && Array.isArray(data.items)) {
        // Se o objeto tem uma propriedade 'items', extrai-los
        allItems = allItems.concat(this.generate(data.items));
      } else {
        // Se não, continua a busca nos valores do objeto
        for (const key in data) {
          allItems = allItems.concat(this.generate(data[key]));
        }
      }
    }
    
    return allItems;
  }
}