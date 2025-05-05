import { Pergunta } from "../pergunta/pergunta.entity";


interface IFormulario {

  formularioId: number;
  titulo: string;
  descricao?: string;
  modeloPadrao: boolean;
  ativo: boolean;
  dataCriacao: Date;
  perguntas?: Pergunta[];
  modeloBaseId?: number; // Referência ao modelo base, se houver
}

type CriarFormularioProps =  Omit<IFormulario, 'formularioId'>[];

export{IFormulario, CriarFormularioProps}