interface ICliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  cidade: string;
  vendedorResponsavel: string;
  dataCadastro: Date;
  ativo: boolean;
}

// Tipo para criação de Cliente (sem id, dataCadastro e ativo — são automáticos)
type CriarClienteProps = Omit<ICliente, "id" | "dataCadastro" | "ativo">;

export { ICliente, CriarClienteProps };
