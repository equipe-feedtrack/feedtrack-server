import { StatusCliente } from '@modules/gestao_clientes/domain/cliente.types';
import { PessoaProps } from '@shared/domain/pessoa.types';

export interface CriarClienteInputDTO {
  pessoa: Omit<PessoaProps, 'id'>; // Dados da pessoa, sem o ID dela
  cidade?: string;
  vendedorResponsavel: string;
  status?: StatusCliente; // Opcional, se tiver padrão na entidade
  // `produtos` não vem no DTO de input de criação, é associado depois ou via outra lógica
}