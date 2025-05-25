import { Cliente } from "@modules/gestao_clientes/domain/cliente/cliente.entity";
import { Pergunta } from "../pergunta/pergunta.entity";

interface IFormulario {
  id?: string;
  titulo: string;
  descricao?: string;
  perguntas?: Pergunta[];
  cliente: Cliente;
  // funcionario: Funcionario;
  ativo?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

type CriarFormularioProps =  Omit<IFormulario, 'id'>;

type RecuperarFormularioProps = Required<IFormulario>;

export { CriarFormularioProps, IFormulario, RecuperarFormularioProps };
