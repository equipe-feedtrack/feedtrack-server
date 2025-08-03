export interface AtualizarCampanhaInputDTO {
  id: string;
  templateMensagem?: string;
  dataInicio?: Date;
  dataFim: Date | null;
  // Adicione outros campos que podem ser atualizados
}