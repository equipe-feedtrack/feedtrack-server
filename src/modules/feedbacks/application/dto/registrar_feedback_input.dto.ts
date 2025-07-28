/**
 * DTO (Data Transfer Object) para os dados de entrada do Caso de Uso RegistrarFeedback.
 * Contém o ID do envio e as respostas do formulário.
 */
export interface RegistrarFeedbackInputDTO {
  envioId: string; // ID do Envio_formulario ao qual este feedback se refere
  respostas: Record<string, any>; // Objeto JSON com as respostas do formulário (que incluirá perguntaId, tipo, etc.)
}