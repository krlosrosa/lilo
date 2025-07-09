import { TransformStrategy } from "./type-transform";
import dayjs from 'dayjs';

export class AddRangeDateAndBelt implements TransformStrategy {
  constructor(
    private readonly rangeMin: number,
    private readonly rangeMax: number
  ) {}

  transform(item: any) {
    const shelf = item.shelf;
    const dataAtual = dayjs();
    const dataFabricacao = dayjs(item.manufacturingDate);
    const dataVencimento = dayjs(item.expirationDate);

    const diasMin = shelf * (this.rangeMin / 100);
    const diasMax = shelf * (this.rangeMax / 100);

    const percentVidaUtil = (dataVencimento.diff(dataAtual, 'day') / shelf) * 100;

    const dataMinima = dataFabricacao.subtract(diasMin, 'day').toDate();
    const dataMaxima = dataFabricacao.add(diasMax, 'day').toDate();

    const percentVidaUtilAjustado = percentVidaUtil - this.rangeMin;

    const base = {
      ...item,
      percentVidaUtil,
      percentVidaUtilAjustado
    };

    if (percentVidaUtil < item.redRange) {
      return { ...base, belt: 'Vermelho', dataMinima: item.manufacturingDate, dataMaxima: item.manufacturingDate };
    }

    if (percentVidaUtil < item.orangeRange || percentVidaUtil < item.yellowRange) {
      return { ...base, belt: 'Amarelo', dataMinima: item.manufacturingDate, dataMaxima: item.manufacturingDate };
    }

    if (percentVidaUtilAjustado < item.yellowRange) {
      const novaDataMinima = dataAtual.subtract((item.yellowRange / 100) * shelf, 'day').toDate();
      return { ...base, belt: 'Verde', dataMinima: novaDataMinima, dataMaxima: item.manufacturingDate };
    }

    return { ...base, belt: 'Verde', dataMinima, dataMaxima };
  }
}
