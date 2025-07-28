import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { Cliente } from "@modules/gestao_clientes/domain/cliente.entity";


// src/application/repositories/IEnvioRepository.ts
export interface IEnvioRepository {
  salvar(envio: Envio): Promise<void>;
  buscarPorId(id: string): Promise<Envio | null>;
  atualizar(envio: Envio): Promise<void>;
}

// src/application/gateways/IWhatsAppGateway.ts
export interface IWhatsAppGateway {
  enviar(destinatario: string, conteudo: string): Promise<void>;
}

// src/application/services/IFeedbackService.ts
export interface IFeedbackService {
  iniciarColeta(formularioId: string, clienteId: string): Promise<string>; // Retorna o feedbackId
}

