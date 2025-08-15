// Interface para as propriedades da Venda
export interface VendaProps {
  id: string
  clienteId: string;
  produtoId: string;
  empresaId: string;
  dataVenda: Date;
}

 export type CriarVendaProps = Omit<VendaProps, 'id' | 'dataVenda'>;