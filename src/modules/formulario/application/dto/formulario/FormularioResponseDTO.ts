import { PerguntaResponseDTO } from "../pergunta/PerguntaResponseDTO";

export interface FormularioResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string; // Data no formato ISO 8601
  dataAtualizacao: string; // Data no formato ISO 8601

  /**
   * A lista de perguntas formatadas que pertencem a este formulário.
   */
  perguntas: PerguntaResponseDTO[];
}