export interface AtualizarFormularioInputDTO {
  id: string;
  titulo?: string;
  descricao?: string;
  ativo?: boolean;
  empresaId: string;
  idsPerguntas?: string[]; // Lista completa de IDs de perguntas que o formulário deve ter.
}