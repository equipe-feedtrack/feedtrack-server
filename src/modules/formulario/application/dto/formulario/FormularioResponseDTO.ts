import { PerguntaResponseDTO } from "../pergunta/PerguntaResponseDTO";

export interface FormularioResponseDTO {
  id: string;
  titulo: string;
  descricao: string | null;
  ativo: boolean;
  empresaId: string;
  dataCriacao: string; // Data no formato ISO 8601
  dataAtualizacao: string; // Data no formato ISO 8601

  /**
   * A lista de perguntas formatadas que pertencem a este formulário.
   */
  perguntas: PerguntaResponseDTO[];
}