import { PerguntaParaCriarDTO } from "./CriarFormularioDTO";

export interface AtualizarFormularioDTO {
  /**
   * O novo título do formulário.
   */
  titulo: string;

  /**
   * A nova descrição do formulário.
   */
  descricao?: string | undefined;

  /**
   * O novo conjunto completo de perguntas. 
   * A abordagem mais simples é substituir todas as perguntas existentes por esta nova lista.
   */
  perguntas: PerguntaParaCriarDTO[];
}