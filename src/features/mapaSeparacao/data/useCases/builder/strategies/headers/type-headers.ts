export interface HeaderStrategy {
  generateHeader: (items: any[], groupKey: string) => any;
}