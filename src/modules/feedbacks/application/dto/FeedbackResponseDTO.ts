 export interface FeedbackResponseDTO { // Renomear para FeedbackResponseDTO para clareza
  id: string;
  formularioId: string;
  resposta: Record<string, any>;
  dataCriacao: string; // String ISO
  dataExclusao?: string | null; // String ISO
 }