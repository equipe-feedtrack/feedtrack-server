interface IFeedback {
  id: string;
  formularioId: string | null; // Pode ser null se não estiver associado a um formulário
  envioId: string | null; // Adicionado para consistência com a entidade
  respostas: Record<string, any>[];
  dataCriacao: Date;
  dataExclusao?: Date | null;
  clienteNome?: string | null;
  produtoNome?: string | null;
  funcionarioNome?: string | null;
  empresaId: string;
}

/**
 * Dados necessários para criar um novo feedback.
 * Não exige `id`, `dataCriacao` nem `dataExclusao` pois são definidos pela entidade.
 */
type CriarFeedbackProps = Omit<IFeedback, "id" | "dataCriacao" | "dataExclusao">;

/**
 * Dados necessários para criar um novo feedback manual.
 */
type CriarFeedbackManualProps = Pick<IFeedback, "clienteNome" | "produtoNome" | "funcionarioNome" | "respostas" | "empresaId">;


/**
 * Usado para reidratar o Feedback a partir de dados persistidos (banco).
 * Todos os campos são obrigatórios.
 */
type RecuperarFeedbackProps = IFeedback;


export {
  IFeedback,
  CriarFeedbackProps,
  RecuperarFeedbackProps,
  CriarFeedbackManualProps
};