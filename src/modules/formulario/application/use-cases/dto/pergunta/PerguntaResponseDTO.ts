export interface PerguntaResponseDTO {
  /**
   * O ID único da pergunta.
   */
  id: string;

  /**
   * O texto da pergunta.
   */
  texto: string;

  /**
   * O tipo da pergunta ('nota', 'texto', etc.).
   */
  tipo: string;

  ativo: boolean;

  /**
   * As opções da pergunta, se houver.
   */
  opcoes?: string[];

  /**
   * A data de criação da pergunta no formato ISO string.
   * @example "2025-07-20T17:30:00.000Z"
   */
  dataCriacao: string;

  /**
   * A data da última atualização.
   */
  dataAtualizacao: string;
}