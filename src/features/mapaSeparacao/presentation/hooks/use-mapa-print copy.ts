import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

export interface HeaderConfig {
  title?: string;
  subtitle?: string;
  logo?: string;
  company?: string;
  date?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export function createTransportPageStyle(transportes: string[]): string {
  let css = `
    @page {
      size: A4;
      margin: 5mm 5mm;
      @bottom-right {
        content: "Página " counter(page) " de " counter(pages);
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #6b7280;
      }
      @bottom-left {
        content: "Impresso em: ${new Date().toLocaleString('pt-BR')}";
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #6b7280;
      }
    }
  `;
  transportes.forEach((transporte) => {
    css += `
      @page transporte-${transporte} {
        margin: 5mm 5mm 15mm 5mm;
        size: A4 portrait;
        @top-center {
          content: "Transporte: ${transporte}";
          font-size: 8pt;
          font-family: Arial, sans-serif;
          color: #6b7280;
        }
      }
    `;
  });
  transportes.forEach((transporte) => {
    css += `.page-transporte-${transporte} { page: transporte-${transporte}; }\n`;
  });
  css += `
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print { display: none !important; }
      .print-page-break { page-break-before: always !important; break-before: page !important; }
      .print-avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
      .print-content { width: 100% !important; max-width: none !important; }
      thead { display: table-header-group !important; }
      tr { page-break-inside: avoid !important; break-inside: avoid !important; }
    }
  `;
  return css;
}

const createMapaPageStyle = (headerConfig?: HeaderConfig): string => {
  const currentDate = headerConfig?.date || new Date().toLocaleString('pt-BR');
  
  return `
    @page {
      size: A4;
      margin: 5mm 5mm;
      @bottom-right {
        content: "Página " counter(page) " de " counter(pages);
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #6b7280;
      }
      @bottom-left {
        content: "Impresso em: ${currentDate}";
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #6b7280;
      }
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .no-print {
        display: none !important;
      }
      
      .print-page-break {
        page-break-before: always !important;
        break-before: page !important;
      }
      
      .print-avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      .print-content {
        width: 100% !important;
        max-width: none !important;
      }
      
      /* Cabeçalho dinâmico */
      .print-header {
        position: relative;
        height: 40mm;
        background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10mm;
        margin-bottom: 5mm;
        box-sizing: border-box;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      
      .print-header-content {
        display: flex;
        align-items: center;
        gap: 8mm;
        width: 100%;
      }
      
      .print-header-logo {
        width: 25mm;
        height: 25mm;
        object-fit: contain;
        flex-shrink: 0;
      }
      
      .print-header-text {
        flex: 1;
        text-align: center;
      }
      
      .print-header-title {
        font-size: 16pt;
        font-weight: bold;
        margin: 0;
        line-height: 1.2;
      }
      
      .print-header-subtitle {
        font-size: 12pt;
        margin: 2mm 0 0 0;
        opacity: 0.9;
      }
      
      .print-header-company {
        font-size: 10pt;
        margin: 1mm 0 0 0;
        opacity: 0.8;
      }
      
      .print-header-date {
        font-size: 10pt;
        opacity: 0.8;
        text-align: right;
        flex-shrink: 0;
        min-width: 30mm;
      }
      
      /* Força cada grupo em uma nova página */
      .group-container:not(:first-child) {
        page-break-before: always !important;
        break-before: page !important;
      }
      
      /* Evita quebras desnecessárias dentro dos componentes */
      .group-info-container,
      .group-summary,
      table,
      .print-avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      /* Mantém cabeçalhos de tabela juntos com o conteúdo */
      thead {
        display: table-header-group !important;
      }
      
      tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  `;
};

interface UseMapaPrintOptions {
  documentTitle?: string;
  headerConfig?: HeaderConfig;
  pageStyle?: string;
  onBeforePrint?: () => Promise<void>;
  onAfterPrint?: () => void;
}

interface UseMapaPrintReturn {
  componentRef: React.MutableRefObject<HTMLDivElement | null>;
  handlePrint: () => void;
  isReady: boolean;
}

export const useMapaPrint = (options: UseMapaPrintOptions = {}): UseMapaPrintReturn => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const {
    documentTitle = 'Mapa Organizado - Resumo de Dados',
    headerConfig,
    pageStyle,
    onBeforePrint,
    onAfterPrint
  } = options;

  const finalPageStyle = pageStyle || createMapaPageStyle(headerConfig);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle,
    onBeforePrint,
    onAfterPrint,
    pageStyle: finalPageStyle
  });

  const printWithCallback = useCallback(() => {
    if (componentRef.current) {
      handlePrint();
    } else {
      console.warn('Referência do componente não encontrada para impressão');
    }
  }, [handlePrint]);

  return {
    componentRef,
    handlePrint: printWithCallback,
    isReady: !!componentRef.current
  };
};

export default useMapaPrint; 

export const headerConfig: HeaderConfig = {
  title: "Mapa de Separação",
  subtitle: "Relatório de Produtos",
  company: "Sua Empresa Ltda",
  showLogo: true,
  logo: "/logo.png",
  showDate: true,
  // date: "2024-01-15" // opcional
};