'use client'

import { RemoteGenerateMap } from "@/features/mapaSeparacao/data/useCases/remote-generate-map";
import { RemoteGenerateProtocol } from "@/features/mapaSeparacao/data/useCases/remote-generate-protcol";
import { RemoteValidateProducts } from "@/features/mapaSeparacao/data/useCases/remote-validate-product";
import { RemoteValidateTransport } from "@/features/mapaSeparacao/data/useCases/remote-validate-transport";
import { ConvertXlsx } from "@/features/mapaSeparacao/infra/convertXlsx";
import MapaSeparacao from "@/features/mapaSeparacao/presentation/pages/mapaSeparacao";

export default function UploadFilePage() {
  const validateProducts = new RemoteValidateProducts(new ConvertXlsx(), new ConvertXlsx());
  const validateRoutes = new RemoteValidateTransport(new ConvertXlsx(), new ConvertXlsx());
  const generateMap = new RemoteGenerateMap(new ConvertXlsx());
  const generateProtocol = new RemoteGenerateProtocol();

  return <MapaSeparacao generateProtocol={generateProtocol} validateProducts={validateProducts} validateRoutes={validateRoutes} generateMap={generateMap} />
}