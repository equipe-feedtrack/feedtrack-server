import { Feedback } from "../domain/feedback.entity";

export interface IFeedbackRepository {
  salvar(feedback: Feedback): Promise<void>;
  salvarManual(feedback: Feedback): Promise<void>;
  recuperarPorUuid(id: string): Promise<Feedback | null>;
  buscarTodos(empresaId: string): Promise<Feedback[]>
}