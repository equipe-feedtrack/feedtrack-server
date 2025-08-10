export interface FeedbackResponseDTO {
  id: string;
  formularioId: string;
  envioId: string;
  respostas: Record<string, any>[];
  dataCriacao: string;
  dataExclusao?: string;
}
