import { Envio } from "@modules/formulario/domain/envioformulario/domain/envio.entity.ts";
import { Cliente } from "@modules/gestao_clientes/domain/cliente/cliente.entity";


// src/application/repositories/IEnvioRepository.ts
export interface IEnvioRepository {
  salvar(envio: Envio): Promise<void>;
  buscarPorId(id: string): Promise<Envio | null>;
}

// src/application/gateways/IWhatsAppGateway.ts
export interface IWhatsAppGateway {
  enviar(destinatario: string, conteudo: string): Promise<void>;
}

// src/application/services/IFeedbackService.ts
export interface IFeedbackService {
  iniciarColeta(formularioId: string, clienteId: string): Promise<string>; // Retorna o feedbackId
}

// src/application/repositories/IClienteRepository.ts (Exemplo de dependência extra)
// Supondo que você tenha um Cliente com um número de telefone
export interface IClienteRepository {
    buscarPorId(id: string): Promise< Cliente| null>;
}