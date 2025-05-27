import { EnvioFormularioService } from "../service/envioFormulario.service";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";

interface EnviarFormularioRequest {
  destinatario: string;
  formulario: Formulario;
  canal: "email"; // pode ser estendido no futuro
}

export class EnviarFormularioUseCase {
  constructor(private envioService: EnvioFormularioService) {}

  async execute(request: EnviarFormularioRequest): Promise<void> {
    const { destinatario, formulario, canal } = request;

    const perguntas = formulario.perguntas.map((p) => p.texto);

    if (canal === "email") {
      await this.envioService.enviarPorEmail(destinatario, formulario);
    }

    // Futuro: suporte a WhatsApp, SMS, etc.
  }
}