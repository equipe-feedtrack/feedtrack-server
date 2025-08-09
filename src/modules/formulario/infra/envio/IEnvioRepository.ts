import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { Cliente } from "@modules/gestao_clientes/domain/cliente.entity";


// src/application/repositories/IEnvioRepository.ts
export interface IEnvioRepository {
  salvar(envio: Envio): Promise<void>;
  buscarPorId(id: string): Promise<Envio | null>;
  atualizar(envio: Envio): Promise<void>;
  salvarVarios(envios: Envio[]): Promise<void>;
  buscarPendentesPorCliente(clienteId: string): Promise<Envio[]>;
  buscarPendentesPorCampanha(campanhaId: string): Promise<Envio[]>;
}

// src/application/gateways/IWhatsAppGateway.ts
export interface IWhatsAppGateway {
  enviar(destinatario: string | null, conteudo: string, formulario: string): Promise<void>;
}

export interface IEmailGateway {
  
}

// src/application/services/IFeedbackService.ts
export interface IFeedbackService {
  iniciarColeta(formularioId: string, clienteId: string): Promise<string>; // Retorna o feedbackId
}

