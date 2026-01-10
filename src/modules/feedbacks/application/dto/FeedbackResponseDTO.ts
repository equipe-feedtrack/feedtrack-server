export interface FeedbackResponseDTO {
  id: string;
  formularioId: string;
  envioId: string;
  empresaId: string;
  respostas: Record<string, any>[];
  dataCriacao: string;
  dataExclusao?: string;
}
