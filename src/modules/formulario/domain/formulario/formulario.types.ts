import { Pergunta } from "../pergunta/pergunta.entity";

interface IFormulario {
  id?: string;
  titulo: string;
  descricao?: string;
  perguntas: Pergunta[];
  ativo?: boolean;
  empresaId: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  dataExclusao?: Date | null;
}

type CriarFormularioProps =  Omit<IFormulario, 'id'>;

type RecuperarFormularioProps = Required<IFormulario>;

export { CriarFormularioProps, IFormulario, RecuperarFormularioProps };