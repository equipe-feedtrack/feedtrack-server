export interface IniciarEnvioDTO {
  clienteId: string;
  formularioId: string;
  usuarioId: string; // O usuário que está a disparar o envio
}


export interface EnvioResponseDTO {
  id: string;
  status: string;
  feedbackId: string;
  clienteId: string;
  formularioId: string;
  produtoId: string
  dataCriacao: string;
  dataEnvio?: string | null;
  erro?: string | null;
}