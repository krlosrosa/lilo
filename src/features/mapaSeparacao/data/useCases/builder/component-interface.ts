import { groupBy } from "lodash";
import { TransformStrategy } from "./strategies/transform/type-transform";
import { SummarizeStrategy } from "./strategies/sumary/sumary-type";
import { SplitStrategy } from "./strategies/split/type-split";
import { HeaderStrategy } from "./strategies/headers/type-headers";

type Operation = {
  type: 'group' | 'transform' | 'summarize' | 'sort' | 'split' | 'header' | 'sortGroup' | 'sortGroupByField' | 'sortItemsByField';
  strategy?: GroupStrategy | TransformStrategy | SummarizeStrategy | SplitStrategy | HeaderStrategy;
  field?: string;
  order?: 'asc' | 'desc';
};

export class MapaSeparacaoBuilder {
  private operations: Operation[] = [];

  addStrategy(strategy: GroupStrategy) {
    this.operations.push({ type: 'group', strategy });
    return this;
  }

  sortGroup(order: 'asc' | 'desc' = 'asc') {
    this.operations.push({ type: 'sortGroup', order });
    return this;
  }

  addHeader(strategy: HeaderStrategy) {
    this.operations.push({ type: 'header', strategy });
    return this;
  }

  addTransform(strategy: TransformStrategy) {
    this.operations.push({ type: 'transform', strategy });
    return this;
  }

  summarize(strategy: SummarizeStrategy) {
    this.operations.push({ type: 'summarize', strategy });
    return this;
  }

  split(strategy: SplitStrategy) {
    this.operations.push({ type: 'split', strategy });
    return this;
  }

  sort(field: string, order: 'asc' | 'desc' = 'asc') {
    this.operations.push({ type: 'sort', field, order });
    return this;
  }

  sortGroupByField(fieldName: string, order: 'asc' | 'desc' = 'asc') {
    this.operations.push({ type: 'sortGroupByField', field: fieldName, order });
    return this;
  }

  sortItemsByField(fieldName: string, order: 'asc' | 'desc' = 'asc') {
    this.operations.push({ type: 'sortItemsByField', field: fieldName, order });
    return this;
  }

  build(data: any[]): any {
    let result: any = data;

    for (const [i, operation] of this.operations.entries()) {
      switch (operation.type) {
        case 'group':
          result = this.applyGrouping(result, operation.strategy as GroupStrategy);
          break;
        case 'transform':
          result = this.applyTransforms(result, [operation.strategy as TransformStrategy]);
          break;
        case 'summarize':
          result = this.applySummarize(result, [operation.strategy as SummarizeStrategy]);
          break;
        case 'split':
          result = this.applySplit(result, operation.strategy as SplitStrategy);
          break;
        case 'sort':
          result = this.applySort(result, operation.field!, operation.order!);
          break;
        case 'header':
          result = this.applyHeader(result, operation.strategy as HeaderStrategy);
          break;
        case 'sortGroup':
          result = this.applySortGroup(result, operation.order!);
          break;
        case 'sortGroupByField':
          result = this.applySortGroupByField(result, operation.field!, operation.order!);
          break;
        case 'sortItemsByField':
          result = this.applySortItemsByField(result, operation.field!, operation.order!);
          break;
      }
    }

    return result;
  }

  private summarizeGroups(data: any): any {
    if (Array.isArray(data)) {
      return `Array(${data.length})`;
    }
    if (typeof data === 'object' && data !== null) {
      const summary: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        summary[key] = this.summarizeGroups(value);
      }
      return summary;
    }
    return typeof data;
  }

  private applyGrouping(data: any, strategy: GroupStrategy): any {
    if (Array.isArray(data)) {
      return strategy.group(data);
    }
    if (typeof data === 'object' && data !== null) {
      const result: Record<string, any> = {};
      for (const [key, items] of Object.entries(data)) {
        result[key] = this.applyGrouping(items, strategy);
      }
      return result;
    }
    return data;
  }

  private applyTransforms(data: any, strategies: TransformStrategy[]): any {
    if (Array.isArray(data)) {
      return data.map(item => {
        let transformed = item;
        for (const strategy of strategies) {
          transformed = strategy.transform(transformed);
        }
        return transformed;
      });
    }
    if (typeof data === 'object' && data !== null) {
      const obj: Record<string, any> = {};
      for (const key of Object.keys(data)) {
        obj[key] = this.applyTransforms(data[key], strategies);
      }
      return obj;
    }
    return data;
  }

  private applySummarize(data: any, strategies: SummarizeStrategy[]): any {
    if (Array.isArray(data)) {
      let summarized = data;
      for (const strategy of strategies) {
        summarized = strategy.summarize(summarized);
      }
      return summarized;
    }
    if (typeof data === 'object' && data !== null) {
      const obj: Record<string, any> = {};
      for (const key of Object.keys(data)) {
        obj[key] = this.applySummarize(data[key], strategies);
      }
      return obj;
    }
    return data;
  }

  private applySplit(data: any, strategy: SplitStrategy): any {
    if (Array.isArray(data)) {
      return strategy.split(data);
    }
    if (typeof data === 'object' && data !== null) {
      const obj: Record<string, any> = {};
      for (const key of Object.keys(data)) {
        obj[key] = this.applySplit(data[key], strategy);
      }
      return obj;
    }
    return data;
  }

  private applySortGroup(data: any, order: 'asc' | 'desc'): any {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      const sortedKeys = Object.keys(data).sort((a, b) =>
        order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      const sortedObj: Record<string, any> = {};
      for (const key of sortedKeys) {
        sortedObj[key] = this.applySortGroup(data[key], order);
      }
      return sortedObj;
    }
    return data;
  }

  private applySort(grouped: any, field: string, order: 'asc' | 'desc'): any {
    if (Array.isArray(grouped)) {
      return [...grouped].sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (typeof grouped === 'object' && grouped !== null) {
      const sortedObj: Record<string, any> = {};
      for (const key of Object.keys(grouped)) {
        sortedObj[key] = this.applySort(grouped[key], field, order);
      }
      return sortedObj;
    }
    return grouped;
  }

  private applySortGroupByField(data: any, field: string, order: 'asc' | 'desc'): any {
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      // Ordena as chaves do objeto agrupado pelo campo especificado no primeiro item de cada grupo
      const sortedKeys = Object.keys(data).sort((a, b) => {
        const aValue = data[a]?.[0]?.[field] ?? '';
        const bValue = data[b]?.[0]?.[field] ?? '';
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      });
      const sortedObj: Record<string, any> = {};
      for (const key of sortedKeys) {
        sortedObj[key] = this.applySortGroupByField(data[key], field, order);
      }
      return sortedObj;
    }
    return data;
  }

  private applySortItemsByField(data: any, field: string, order: 'asc' | 'desc'): any {
    if (Array.isArray(data)) {
      return [...data].sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (typeof data === 'object' && data !== null) {
      const obj: Record<string, any> = {};
      for (const key of Object.keys(data)) {
        obj[key] = this.applySortItemsByField(data[key], field, order);
      }
      return obj;
    }
    return data;
  }

  private flattenDeep(data: any): any[] {
    if (Array.isArray(data)) return data;

    if (typeof data === 'object' && data !== null) {
      return Object.values(data).flatMap(value => this.flattenDeep(value));
    }

    return [];
  }

  private applyHeader(data: any, strategy: HeaderStrategy): any {
    if (Array.isArray(data)) {
      return {
        header: strategy.generateHeader(data, ''),
        items: data
      };
    }

    if (typeof data === 'object' && data !== null) {
      const result: Record<string, any> = {};

      for (const [key, value] of Object.entries(data)) {
        const processed = this.applyHeader(value, strategy);
        const items = processed.items ?? processed; // para casos com ou sem header

        result[key] = {
          header: strategy.generateHeader(
            this.flattenDeep(items), // pega todos os itens terminal
            key
          ),
          items: items
        };
      }

      return result;
    }

    return data;
  }

}

export interface GroupStrategy {
  group: (data: any[]) => GroupedResult;
}


export type GroupedResult = Record<string, any[]>;



