import { Feedback } from "../domain/feedback.entity";

export interface FeedbackRepository {
  salvar(feedback: Feedback): Promise<void>;
  buscarPorId(id: string): Promise<Feedback | null>;
  buscarPorFormulario(formularioId: string): Promise<Feedback[]>;
}