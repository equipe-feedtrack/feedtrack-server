export interface AtualizarCampanhaInputDTO {
  id: string;
  titulo?: string;
  descricao?: string;
  formularioId?: string;
  empresaId: string;
  canalEnvio?: string;
  templateMensagem?: string;
  // Adicione outros campos que podem ser atualizados
}