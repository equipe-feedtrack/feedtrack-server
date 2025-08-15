import { IUseCase } from "@shared/application/use-case/usecase.interface";
import { CriarFeedbackManualProps } from "../../domain/feedback.types";
import { IFeedbackRepository } from "../../infra/feedback.repository";
import { Feedback } from "../../domain/feedback.entity";

export class CriarFeedbackManualUseCase implements IUseCase<CriarFeedbackManualProps, Feedback> {
    constructor(private readonly feedbackRepository: IFeedbackRepository) {}

    async execute(props: CriarFeedbackManualProps): Promise<Feedback> {
        const feedback = Feedback.criarManual(props);
        await this.feedbackRepository.salvarManual(feedback);
        return feedback;
    }
}
