import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface UsePrintResupplyProps {
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export const usePrintResupply = ({ onBeforePrint, onAfterPrint }: UsePrintResupplyProps = {}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Lista de Resuprimento',
    onAfterPrint: onAfterPrint,
    pageStyle: `
      @page {
        size: A4;
        margin: 5mm;
      }
      @media print {
        .no-print {
          display: none !important;
        }
        /* Hide summary cards when printing */
        .grid {
          display: none !important;
        }
        /* Hide card header and description */
        .print-table > div:first-child {
          display: none !important;
        }
        /* Remove card styling and borders */
        .print-table {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: none !important;
        }
        /* Remove card content padding */
        .print-table > div:last-child {
          padding: 0 !important;
        }
        /* Remove inner border wrapper */
        .print-table .rounded-md {
          border: none !important;
          border-radius: 0 !important;
        }
        /* Auto adjust table width */
        table {
          width: 100% !important;
          table-layout: auto !important;
        }
        /* Auto adjust column widths */
        th, td {
          width: auto !important;
          max-width: none !important;
          white-space: nowrap !important;
        }
        /* Allow description column to wrap if needed */
        th:nth-child(2), td:nth-child(2) {
          white-space: normal !important;
          word-wrap: break-word !important;
        }
        .print-header {
          display: block !important;
        }
        .print-summary {
          display: none !important;
        }
      }
    `,
  });

  const printWithCallback = () => {
    if (onBeforePrint) {
      onBeforePrint();
    }
    handlePrint();
  };

  return {
    componentRef,
    handlePrint: printWithCallback,
  };
};
