export interface AtualizarCampanhaInputDTO {
  id: string;
  titulo?: string;
  descricao?: string;
  formularioId?: string;
  tipoCampanha?: string;
  segmentoAlvo?: string;
  templateMensagem?: string;
  dataFim?: Date | null;
  ativo?: boolean; // Adicionado para permitir a atualização do status
  // Adicione outros campos que podem ser atualizados
}