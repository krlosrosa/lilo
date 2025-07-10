
import { GenerateMap, GenerateMapResult, PropsConfig } from "../../domain/generate-map";
import { RemoteConverterXlsx } from "../protocols/remote-converter-xlsx";
import { MapaSeparacaoBuilder } from "./builder/component-interface";
import { GroupByTransport } from "./builder/strategies/grouped/groupByTransport";
import { GroupByClient } from "./builder/strategies/grouped/groupByClient";
import { MapSaleToBoxesAndUnits } from "./builder/strategies/transform/mapSaleToBoxesAndUnits";
import { SumByItemAndLoteStrategy } from "./builder/strategies/sumary/sumByItemAndLoteStrategy";
import { AddInfoProduct } from "./builder/strategies/transform/addInfoProduct";
import { ConvertUnitsToBoxes } from "./builder/strategies/transform/convertUnitsToBoxes";
import { ConvertBoxToPallets } from "./builder/strategies/transform/convertBoxToPallets";
import { AddRangeDateAndBelt } from "./builder/strategies/transform/addRangeDateAndBelt";
import { SplitPalletAndUnits } from "./builder/strategies/split/splitPalletAndUnits";
import { GroupByFifoPalletUnitPicking } from "./builder/strategies/grouped/groupByFifoPalletUnitPicking";
import { SimpleHeaderStrategy } from "./builder/strategies/headers/simpleHeaderStrategy";
import { GroupByLine } from "./builder/strategies/grouped/groupByLine";
import { GroupByLineCount } from "./builder/strategies/grouped/groupByLineCount";
import { GroupByCompany } from "./builder/strategies/grouped/groupByCompany";
import { GroupByPalletPercentage } from "./builder/strategies/grouped/groupByPercentPallet";
import _ from "lodash";

export class RemoteGenerateMap implements GenerateMap {

  constructor(
    private readonly convertShipment: RemoteConverterXlsx
  ) { }


  async generateMap(config: PropsConfig, shipmentItems: File, products: File, routerItems: File): Promise<GenerateMapResult> {
    const shipment = await this.convertShipment.convertShipment(shipmentItems)
    const listProducts = await this.convertShipment.convertProducts(products)
    const router = routerItems ? await this.convertShipment.convertRouting(routerItems) : null
    const builder = new MapaSeparacaoBuilder()
    if (config.tipo === 'transport') {
      builder.addStrategy(new GroupByTransport(config.remessas, config.transportes, config.segregedClients))
    }
    if (config.tipo === 'customerCode') {
      builder.addStrategy(new GroupByClient(config.clientes))
    }
    // Ordenar os itens de cada grupo por transporte
    builder.sortItemsByField('transport', 'asc')
    builder.addTransform(new MapSaleToBoxesAndUnits())
    builder.addTransform(new AddInfoProduct(listProducts))
    builder.addStrategy(new GroupByCompany())
    builder.addStrategy(new GroupByLine())
    builder.sort('pickWay', 'asc')
    builder.summarize(new SumByItemAndLoteStrategy())
    builder.addTransform(new ConvertUnitsToBoxes())
    builder.addTransform(new ConvertBoxToPallets())
    builder.addTransform(new AddRangeDateAndBelt(config.minRange, config.maxRange))
    builder.split(new SplitPalletAndUnits())
    builder.addStrategy(new GroupByFifoPalletUnitPicking(config))
    builder.sortGroup('asc')
    if (config.isLine) {
      builder.addStrategy(new GroupByLineCount(config, config.maxLine))
    }
    if (config.isPallet) {
      builder.addStrategy(new GroupByPalletPercentage(config, config.maxPallet))
    }
    builder.summarize(new SumByItemAndLoteStrategy())
    builder.addHeader(new SimpleHeaderStrategy(config.tipo, router))
    const result = builder.build(shipment)
    
    return result
  }
}