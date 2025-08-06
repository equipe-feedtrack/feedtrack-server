interface IFeedback {
  id: string;
  formularioId: string;
  envioId: string; // Adicionado para consistência com a entidade
  respostas: Record<string, any>[];
  dataCriacao: Date;
  dataExclusao?: Date | null;
}

/**
 * Dados necessários para criar um novo feedback.
 * Não exige `id`, `dataCriacao` nem `dataExclusao` pois são definidos pela entidade.
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
