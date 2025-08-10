export interface CriarFormularioInputDTO {
  titulo: string;
  descricao: string;
  ativo?: boolean;
  idsPerguntas: string[]; // Recebemos os IDs das perguntas a serem associadas.
}