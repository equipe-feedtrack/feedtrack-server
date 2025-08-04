 export interface FeedbackResponseDTO { // Renomear para FeedbackResponseDTO para clareza
  id: string;
  formularioId: string;
  envioId: String;
  resposta: Record<string, any>;
  dataCriacao: string; // String ISO
  dataExclusao?: string | null; // String ISO
 }