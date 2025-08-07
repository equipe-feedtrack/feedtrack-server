export interface AtualizarCampanhaInputDTO {
  id: string;
  templateMensagem?: string;
  dataInicio?: Date;
  dataFim: Date | null;
  ativo?: boolean; // Adicionado para permitir a atualização do status
  // Adicione outros campos que podem ser atualizados
}