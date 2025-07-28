import { Feedback } from "../domain/feedback.entity";

export interface IFeedbackRepository {
  inserir(feedback: Feedback): Promise<void>;
  recuperarPorUuid(id: string): Promise<Feedback | null>;
}