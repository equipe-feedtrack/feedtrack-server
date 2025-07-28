import { TipoPergunta } from "@shared/domain/data.types";

interface IFeedback {
  id: string;
  formularioId: string;
  resposta: Record<string, any>; // <-- AGORA É UM ÚNICO OBJETO JSON
  dataCriacao: Date; // Usar dataCriacao para alinhamento com IDatasControle
  dataExclusao?: Date | null;
}

/**
 * Dados necessários para criar um novo feedback.
 * Não exige `id` nem `data_resposta` pois são definidos pela entidade.
 */
type CriarFeedbackProps = Omit<IFeedback, "id" | "dataCriacao" | "dataExclusao">;

/**
 * Usado para reidratar o Feedback a partir de dados persistidos (banco).
 * Todos os campos são obrigatórios.
 */
type RecuperarFeedbackProps = IFeedback;


export {
  IFeedback,
  CriarFeedbackProps,
  RecuperarFeedbackProps,
};
