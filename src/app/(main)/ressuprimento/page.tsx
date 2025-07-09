'use client'
import ListResuprimento from "@/features/ressuprimento/presentation/pages/listResuprimento";
import { RemoteGenerateResupply } from "@/features/ressuprimento/data/useCases/remote.generate-resupply";


export default function Resuprimento() {
  const generateResupply = new RemoteGenerateResupply();
  return (
    <ListResuprimento generateResupply={generateResupply} />
  )
}