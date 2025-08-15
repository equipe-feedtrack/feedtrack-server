import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

export interface ListarFormulariosInputDTO {
  ativo?: boolean;
}

export interface ListarFormulariosResponseDTO {
  id: string;
  titulo: string;
  descricao: string | null;
  ativo: boolean;
  empresaId: string;
  dataCriacao: string; // A data é enviada como uma string no formato ISO 8601
  perguntas: Pergunta[]
}