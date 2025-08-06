import { StatusFormulario } from "@prisma/client";

interface EnvioProps {
  id: string;
  clienteId: string;
  usuarioId: string;
  formularioId: string;
  feedbackId: string;
  status: StatusFormulario;
  dataCriacao: Date;
  dataEnvio?: Date | null;
  tentativasEnvio: number;
  ultimaMensagemErro?: string | null;
}

export {EnvioProps}