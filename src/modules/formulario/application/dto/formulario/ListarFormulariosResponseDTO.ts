export interface ListarFormulariosResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  ativo: boolean;
  dataCriacao: string; // Data no formato ISO 8601
  
  /**
   * Um campo útil que informa quantas perguntas o formulário possui,
   * sem precisar carregar todas elas.
   */
  quantidadePerguntas: number;
}