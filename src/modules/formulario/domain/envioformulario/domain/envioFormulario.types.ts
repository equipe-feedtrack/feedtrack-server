import { Formulario } from "../../formulario/formulario.entity";

interface IEnvioFormularioProps {
  id?: string;
  data_envio: Date;
  destinatario: string;
  formulario: Formulario;
  canal: "email" | "whatsapp" | string;
}

export interface CanalEnvioFormulario {
  enviar(destinatario: string, titulo: string, perguntas: string[]): Promise<void>;
}

export{ IEnvioFormularioProps}