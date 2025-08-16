import { TipoPergunta } from "@shared/domain/data.types";

export interface AtualizarPerguntaInputDTO {
  id: string; // O ID da pergunta a ser atualizada é obrigatório.
  texto?: string;
  tipo?: TipoPergunta;
  empresaId: string;

  // Outros campos como 'tipo' e 'opcoes' podem ser adicionados se a atualização deles for permitida.
}