import { TipoPergunta } from "@shared/domain/data.types";

export interface PerguntaParaCriarDTO {
  /**
   * O texto da pergunta.
   */
  texto: string;
  
  /**
   * O tipo da pergunta.
   */
  tipo: TipoPergunta;

  /**
   * As opções, caso o tipo seja 'multipla_escolha'.
   */
  opcoes?: string[];
}

export interface CriarFormularioDTO {
  /**
   * O título principal do formulário.
   * @example "Pesquisa de Satisfação do Cliente - Q3 2025"
   */
  titulo: string;

  /**
   * Uma descrição opcional para o formulário.
   * @example "Formulário para coletar feedback sobre nossos novos serviços."
   */
  descricao?: string;

  /**
   * Uma lista com os dados das perguntas que farão parte deste formulário.
   */
 perguntasIds: string[];
}