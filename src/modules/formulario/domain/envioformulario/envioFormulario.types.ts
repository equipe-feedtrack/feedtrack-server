import { StatusFormulario } from "@prisma/client";

export interface IEnvio {
  id: string;
  status: StatusFormulario;
  feedbackId: string | null;
  clienteId: string;
  formularioId: string;
  campanhaId: string;
  usuarioId: string;
  dataCriacao: Date;
  dataEnvio: Date | null;
  tentativasEnvio: number;
  ultimaMensagemErro: string | null;
}

export type CriarEnvioProps = Omit<
  IEnvio,
  'id' | 'status' | 'dataCriacao' | 'dataEnvio' | 'tentativasEnvio' | 'ultimaMensagemErro' | 'feedbackId'
>;

export type RecuperarEnvioProps = IEnvio;