import { TipoPergunta } from "@shared/domain/data.types";

export interface CriarPerguntaDTO {
  /**
   * O texto da pergunta a ser criada.
   * @example "Qual o seu nível de satisfação com o nosso atendimento?"
   */
  texto: string;

  /**
   * O tipo da pergunta, que define como ela será respondida.
   */
  tipo: TipoPergunta;

  /**
   * Um array de strings para as opções, obrigatório apenas se o tipo for 'multipla_escolha'.
   * @example ["Ruim", "Regular", "Bom", "Excelente"]
   */
  opcoes?: string[];

  /**
   * O ID do formulário ao qual esta pergunta pertence.
   */
  formularioId: string;
}