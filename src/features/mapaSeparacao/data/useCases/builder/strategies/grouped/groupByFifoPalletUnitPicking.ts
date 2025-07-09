import { groupBy } from "lodash";
import { GroupedResult, GroupStrategy } from "../../component-interface";
import { PropsConfig } from "@/features/mapaSeparacao/domain/generate-map";

export class GroupByFifoPalletUnitPicking implements GroupStrategy {
  constructor(private readonly config: PropsConfig) { }
  group(data: any[]): GroupedResult {
    return groupBy(data, (item) => {
      if(this.config.isSegregedFifo){
        if(this.config.rangeFifo.includes(item.belt)){
          return 'tipo:2-FIFO'
        }
      }
      if(this.config.unidadesSeparadas){
        if(item.units > 0){
          return 'tipo:3-Unidades'
        }
      }
      if(this.config.palletsFull){
        if(item.Pallets > 0){
          return 'tipo:0-Pallet'
        }
      }
      return 'tipo:1-Picking'
    });
  }
}
