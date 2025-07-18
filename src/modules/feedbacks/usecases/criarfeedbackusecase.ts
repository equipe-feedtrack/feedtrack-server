import { TipoPergunta } from "@shared/domain/data.types";
import { Feedback } from "../domain/feedback.entity";
import { FeedbackRepository } from "../infra/feedback.repository";

interface CriarFeedbackParaFormularioInput {
  formularioId: string;
  respostas: {
    perguntaId: string;
    tipo: TipoPergunta;
    resposta_texto?: string;
    nota?: number;
    opcaoEscolhida?: string;
  }[];
}

export class CriarFeedbacksParaFormularioUseCase {
  constructor(private feedbackRepository: FeedbackRepository) {}

  async execute(input: CriarFeedbackParaFormularioInput): Promise<void> {
    const { formularioId, respostas } = input;

    for (const resposta of respostas) {
      const feedback = Feedback.criarFeedback({
        formularioId,
        perguntaId: resposta.perguntaId,
        tipo: resposta.tipo,
        resposta_texto: resposta.resposta_texto,
        nota: resposta.nota,
        opcaoEscolhida: resposta.opcaoEscolhida,
      });

      await this.feedbackRepository.salvar(feedback);
    }
  }
}