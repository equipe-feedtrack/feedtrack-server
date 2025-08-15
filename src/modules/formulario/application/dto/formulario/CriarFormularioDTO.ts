export interface CriarFormularioInputDTO {
  titulo: string;
  descricao: string;
  ativo?: boolean;
  empresaId: string;
  idsPerguntas: string[];

}