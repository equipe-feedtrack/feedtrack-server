import { TipoPergunta } from "@shared/domain/data.types";

export interface AtualizarPerguntaDTO {
  /**
   * O novo texto da pergunta. Opcional.
   */
  texto?: string;

  /**
   * O novo tipo da pergunta. Opcional.
   */
  tipo?: TipoPergunta;

  /**
   * O novo conjunto de opções. Opcional.
   */
  opcoes?: string[];
}