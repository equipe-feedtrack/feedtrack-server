import { Feedback } from "../domain/feedback.entity";

export interface IFeedbackRepository {
  salvar(feedback: Feedback): Promise<void>;
  recuperarPorUuid(id: string): Promise<Feedback | null>;
  buscarTodos(): Promise<Feedback[]>
}