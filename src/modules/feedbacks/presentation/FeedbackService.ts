import { IFeedbackService } from "@modules/formulario/infra/envio/IEnvioRepository";
import { randomUUID } from "crypto";

/**
 * Esta é uma implementação SIMULADA do serviço de Feedback.
 * No futuro, esta classe poderia fazer uma chamada a um outro microsserviço
 * ou interagir com o repositório de Feedback para criar um registro real no banco.
 */
export class FeedbackService implements IFeedbackService {
  async iniciarColeta(formularioId: string, clienteId: string): Promise<string> {
    console.log(`[FeedbackService] Iniciando coleta para formulário ${formularioId} e cliente ${clienteId}.`);
    
    // Simula a criação de um registro de feedback no banco de dados.
    const feedbackId = randomUUID();
    
    console.log(`[FeedbackService] ID de coleta gerado: ${feedbackId}`);

    // Retorna o ID que será usado para construir o link de envio.
    return feedbackId;
  }
}