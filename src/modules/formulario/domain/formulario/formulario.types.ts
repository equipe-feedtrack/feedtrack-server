import { Pergunta } from "../pergunta/pergunta.entity";
import { ClienteEssencial } from "@modules/gestao_clientes/domain/cliente/cliente.types";

interface IFormulario {
  id?: string;
  titulo: string;
  descricao?: string;
  perguntas?: Pergunta[];
  cliente: ClienteEssencial;
  ativo?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

type CriarFormularioProps =  Omit<IFormulario, 'id'>;

type RecuperarFormularioProps = Required<IFormulario>;

export { CriarFormularioProps, IFormulario, RecuperarFormularioProps };
