import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Feedback } from "../domain/feedback/feedback.entity";
import { FeedbackDTO, IFeedback, IRecuperarFeedbackProps } from "../domain/feedback/feedback.types";
import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

class FeedbackMap {
    static toDTO(feedback: Feedback): FeedbackDTO {
        return {
            id: feedback.id,
            formularioId: feedback.formulario.id,
            perguntaId: feedback.pergunta.id,
            tipo: feedback.tipo,
            resposta_texto: feedback.resposta_texto,
            nota: feedback.nota,
            opcaoEscolhida: feedback.opcaoEscolhida,
            data_resposta: feedback.data_resposta,
        };
    }
    static toDomain(dto: FeedbackDTO, formulario: Formulario, pergunta: Pergunta): Feedback {
      return new Feedback({
        id: dto.id,
        formulario,
        pergunta,
        tipo: dto.tipo,
        resposta_texto: dto.resposta_texto,
        nota: dto.nota,
        opcaoEscolhida: dto.opcaoEscolhida,
        data_resposta: dto.data_resposta,
      });
    }
    
}

export { FeedbackMap };