import { Status_formulario } from "@prisma/client";

interface EnvioProps {
  id: string;
  clienteId: string;
  usuarioId: string;
  formularioId: string;
  feedbackId: string;
  status: Status_formulario;
  dataCriacao: Date;
  dataEnvio?: Date | null;
  tentativasEnvio: number;
  ultimaMensagemErro?: string | null;
}

export {EnvioProps}