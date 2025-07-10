import { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

const createMapaPageStyle = (): string => {
  return `
    @page {
      size: A4;
      margin: 5mm;
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
  pageStyle?: string;
  onBeforePrint?: () => Promise<void>;
  onAfterPrint?: () => void;
}

interface UseMapaPrintReturn {
  componentRef: React.RefObject<HTMLDivElement | null>;
  handlePrint: () => void;
  isReady: boolean;
}

export const useMapaPrint = (
  options: UseMapaPrintOptions = {}
): UseMapaPrintReturn => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const {
    documentTitle = '',
    pageStyle,
    onBeforePrint,
    onAfterPrint,
  } = options;

  const finalPageStyle = createMapaPageStyle();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle,
    onBeforePrint,
    onAfterPrint,
    pageStyle: finalPageStyle,
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
    isReady: !!componentRef.current,
  };
};

export default useMapaPrint;