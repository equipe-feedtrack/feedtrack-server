import { FeedbackExceptions } from "@modules/feedbacks/domain/feedback.exceptions";
import { CriarFeedbackProps } from "@modules/feedbacks/domain/feedback.types";
import { TipoPergunta } from "@shared/domain/data.types";
import { isUUID } from "class-validator/types/decorator/string/IsUUID";

// Validação manual para a resposta de uma única pergunta
export class RespostaDTO {
  perguntaId: string;
  tipo: TipoPergunta;
  resposta_texto?: string | null;
  nota?: number | null;
  opcaoEscolhida?: string | null;

  constructor(data: any) {
    this.perguntaId = data.perguntaId;
    this.tipo = data.tipo;
    this.resposta_texto = data.resposta_texto;
    this.nota = data.nota;
    this.opcaoEscolhida = data.opcaoEscolhida;
  }
}

/**
 * @description DTO para criar um novo Feedback.
 * Representa o corpo da requisição HTTP e valida os dados de forma manual.
 */
export class CriarFeedbackDTO implements CriarFeedbackProps {
  formularioId: string;
  envioId: string;
  respostas: RespostaDTO[];
  empresaId: string;

  constructor(data: any) {
    // Validação de campos principais
    if (!data.formularioId || !isUUID(data.formularioId)) {
      throw new FeedbackExceptions.RespostaInvalida('ID do formulário deve ser um UUID válido.');
    }
    if (!data.envioId || !isUUID(data.envioId)) {
      throw new FeedbackExceptions.RespostaInvalida('ID do envio deve ser um UUID válido.');
    }
    if (!Array.isArray(data.respostas) || data.respostas.length === 0) {
      throw new FeedbackExceptions.RespostaInvalida('As respostas devem ser um array não vazio.');
    }
    if (!data.empresaId || !isUUID(data.empresaId)) {
      throw new FeedbackExceptions.RespostaInvalida('ID da empresa deve ser um UUID válido.');
    }

    this.formularioId = data.formularioId;
    this.envioId = data.envioId;
    this.respostas = data.respostas.map((r: any) => new RespostaDTO(r));
    this.empresaId = data.empresaId;
  }
}

export interface FeedbackResponseDTO {
  id: string;
  formularioId: string | null;
  envioId: string | null;
  respostas: Record<string, any>[]; // Array de respostas
  dataCriacao: string; // ISO string
  dataExclusao?: string; // ISO string ou undefined
  clienteNome?: string | null;
  produtoNome?: string | null;
  funcionarioNome?: string | null;
  empresaId: string;
}