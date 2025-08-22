export interface ListarFormulariosInputDTO {
  empresaId: string; // obrigatório
}

export interface PerguntaDTO {
  id: string;
  texto: string;
  opcoes?: string[];
  // outros campos necessários
}

export interface ListarFormulariosResponseDTO {
  id: string;
  titulo: string;
<<<<<<< HEAD
  descricao: string | null;
=======
  descricao?: string;
>>>>>>> develop
  ativo: boolean;
  empresaId: string;
  dataCriacao: string; // ISO 8601
  perguntas: PerguntaDTO[];
}
