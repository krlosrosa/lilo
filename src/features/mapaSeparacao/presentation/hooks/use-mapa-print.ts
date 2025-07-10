import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

/**
 * Hook customizado para simplificar a impressão de componentes React.
 *
 * @param options - Opções para configurar o título do documento e callbacks.
 * @returns Retorna uma referência `componentRef` para ser ligada ao seu componente
 * e uma função `handlePrint` para iniciar a impressão.
 *
 * @example
 * const { componentRef, handlePrint } = useMapaPrint({
 *   transportes: ['TRANSPORTE_A', 'TRANSPORTE_B']
 * });
 *
 * return (
 *   <div>
 *     <button onClick={handlePrint}>Imprimir</button>
 *     <div ref={componentRef}>
 *       <div className="page-transporte-TRANSPORTE_A">
 *         <h1>Conteúdo do Transporte A</h1>
 *       </div>
 *       <div className="page-transporte-TRANSPORTE_B print-page-break">
 *         <h1>Conteúdo do Transporte B</h1>
 *       </div>
 *     </div>
 *   </div>
 * );
 */
export const useMapaPrint = (options: {
  documentTitle?: string;
  transportes?: string[];
  onBeforePrint?: () => Promise<void>;
  onAfterPrint?: () => void;
} = {}) => {
  // 1. A referência para o componente que será impresso.
  // Você precisa ligar isso ao seu componente: <div ref={componentRef}>...</div>
  const componentRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession()
  // 2. Desestruturação das opções com valores padrão.
  const {
    transportes = [],
    onBeforePrint,
    onAfterPrint,
  } = options;

  // 3. Estilos CSS aplicados apenas durante a impressão.
  // Define o layout da página (A4), margens e rodapé com número de página e data.
  const transporteNome = transportes.length > 0 ? transportes[0] : '';
  
  let pageStyle = `
    @page {
      size: A4;
      margin-top: 20mm;
      margin-bottom: 20mm;
      margin-left: 5mm;
      margin-right: 5mm;

      /* Força o conteúdo das áreas de cabeçalho a ser vazio, removendo o padrão do navegador */
      @top-center { content: ""; }
      @top-left { 
        content: "${transporteNome ? `Transporte: ${transporteNome}` : ''}";
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #71717a; /* zinc-500 */
      }
      @top-right { content: ""; }

      @bottom-right {
        content: "Página " counter(page) " de " counter(pages);
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #71717a; /* zinc-500 */
      }
      @bottom-left {
        content: "Impresso em: ${new Date().toLocaleString('pt-BR')} - impressão por ${session?.user?.name} ";
        font-size: 8pt;
        font-family: Arial, sans-serif;
        color: #71717a; /* zinc-500 */
      }
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
      .print-page-break {
        page-break-before: always !important;
      }
    }
  `;

  // 6. A função de impressão fornecida pela biblioteca react-to-print.
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    onBeforePrint,
    onAfterPrint,
    pageStyle,
  });

  // 7. Retorna apenas o essencial: a ref e a função para imprimir.
  return { componentRef, handlePrint };
};

export default useMapaPrint;