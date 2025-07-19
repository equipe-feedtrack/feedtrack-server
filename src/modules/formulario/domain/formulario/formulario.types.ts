import { Pergunta } from "../pergunta/domain/pergunta.entity";
import { ClienteEssencial } from "@modules/gestao_clientes/domain/cliente/cliente.types";
import { IPergunta } from "../pergunta/domain/pergunta.types";
import { CriarPerguntaDTO } from "@modules/formulario/application/criarFormularioDTO";

interface IFormulario {
  id?: string;
  titulo: string;
  descricao?: string;
  perguntas: CriarPerguntaDTO[];
  ativo?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  dataExclusao?: Date | null;
}

type CriarFormularioProps =  Omit<IFormulario, 'id'>;

type RecuperarFormularioProps = Required<IFormulario>;

export { CriarFormularioProps, IFormulario, RecuperarFormularioProps };
