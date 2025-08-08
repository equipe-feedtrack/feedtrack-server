export interface PerguntaResponseDTO {
  /**
   * O ID único da pergunta.
   */
  _id: string;

  /**
   * O texto da pergunta.
   */
  _texto: string;

  /**
   * O tipo da pergunta ('nota', 'texto', etc.).
   */
  _tipo: string;

  _ativo: boolean;

  /**
   * As opções da pergunta, se houver.
   */
  _opcoes?: string[];

  /**
   * A data de criação da pergunta no formato ISO string.
   * @example "2025-07-20T17:30:00.000Z"
   */
  _dataCriacao: string;

  /**
   * A data da última atualização.
   */
  _dataAtualizacao: string;
}