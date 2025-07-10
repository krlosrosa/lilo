import { Table } from "./table";
import { Header } from "./header";

type Props = {
  group: any
  type: 'transport' | 'customerCode';
  path?: string[]
  index?: number
}

type GroupWithItemsAndHeader = {
  items: any[];
  header?: any;
  [key: string]: any;
};

function isGroupWithItemsAndHeader(value: any): value is GroupWithItemsAndHeader {
  return (
    value &&
    typeof value === 'object' &&
    Array.isArray(value.items)
  );
}

export const PrintPage = ({ group, path = [], type }: Props) => {
  return (
    <>
      {Object.entries(group).map(([key, value], index) => {

        const newPath = [...path, key];
        // Caso value seja um objeto com items (array) e header
        if (isGroupWithItemsAndHeader(value)) {
          const transporte = value.header?.transporte;
          const transporteClass = transporte ? `page-transporte-${transporte}` : '';
          return (
            <div key={newPath.join('|')} className={`mb-4 page-break ${transporteClass}`}>
              {value.header && <Header index={index} key={index} header={value.header} caminho={newPath.join(' > ')} type={type} />}
              <Table data={value.items} ariaLabel={`Tabela do caminho ${newPath.join(' > ')}`} caminho={newPath.join(' > ')} />
            </div>
          );
        }
        // Caso value seja um array simples
        if (Array.isArray(value)) {
          return (
            <div key={newPath.join('|')} className="mb-4 page-break">
              <Table data={value} ariaLabel={`Tabela do caminho ${newPath.join(' > ')}`} caminho={newPath.join(' > ')} />
            </div>
          );
        }
        if (value && typeof value === 'object') {
          return <PrintPage index={index} type={type} key={newPath.join('|')} group={value} path={newPath} />;
        }
        // Não renderiza nada para valores primitivos
        return null;
      })}
    </>
  );
}