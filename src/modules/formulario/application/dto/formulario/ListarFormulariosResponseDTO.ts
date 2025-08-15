import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

export interface ListarFormulariosInputDTO {
  ativo?: boolean;
}

export interface PerguntaDTO {
  id: string;
  texto: string;
  opcoes?: string[];
  // outros campos necessários
}


export interface ListarFormulariosResponseDTO {
  id: string;
  titulo: string;
  descricao?: string ;
  ativo: boolean;
  empresaId: string;
  dataCriacao: string; // A data é enviada como uma string no formato ISO 8601
  perguntas: PerguntaDTO[]
}