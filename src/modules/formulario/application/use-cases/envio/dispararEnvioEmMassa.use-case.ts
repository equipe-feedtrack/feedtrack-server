import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity";
import { IEmailGateway, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { CanalEnvio } from "@prisma/client";

interface DisparoEmMassaConfig {
  quantidade: number;
  intervalo: number; // Em horas
}

/**
 * @description Use Case para disparar Envios de formulário em massa.
 * Ele recupera clientes, cria entidades de Envio e as envia em lotes.
 */
export class DispararEnvioEmMassaUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly whatsAppGateway: IWhatsAppGateway,
    private readonly EmailGateway: IEmailGateway,
  ) {}

  public async execute(campanhaId: string, config: DisparoEmMassaConfig, produtoId: string): Promise<void> {
    const campanha = await this.campanhaRepository.recuperarPorUuid(campanhaId);
    if (!campanha) {
      throw new Error("Campanha não encontrada.");
    }

    const clientes = await this.clienteRepository.buscarClientesParaCampanha(campanha.segmentoAlvo);

    let enviosPendentes = [];
    for (const cliente of clientes) {
      const envio = Envio.criar({
        clienteId: cliente.id,
        campanhaId: campanha.id,
        formularioId: campanha.formularioId,
        usuarioId: "system-user-uuid",
        produtoId,
        empresaId: campanha.empresaId
      });
      enviosPendentes.push(envio);
    }
    
    console.log(`Iniciando disparo em massa para ${enviosPendentes.length} clientes. Lote: ${config.quantidade}, Intervalo: ${config.intervalo}h`);

    for (let i = 0; i < enviosPendentes.length; i += config.quantidade) {
      const lote = enviosPendentes.slice(i, i + config.quantidade);
      console.log(`Processando lote de ${lote.length} envios.`);

      const operacoesDeEnvio = lote.map(async envio => {
        try {
          // Lógica de envio por e-mail ou WhatsApp com base na Campanha
         const conteudo = campanha.templateMensagem;
         const campanhaId = envio.campanhaId;
         const formularioId = envio.formularioId;
         const clienteId = envio.clienteId;
         
         const clienteParaEnvio = clientes.find(c => c.id === envio.clienteId);
          if (!clienteParaEnvio) { 
            envio.registrarFalha(`Cliente com ID ${envio.clienteId} não encontrado na lista de clientes da campanha.`);
            return; // Pula para o próximo item do array
          }

          if (campanha.canalEnvio === CanalEnvio.EMAIL) {
              await this.EmailGateway.enviar(clienteParaEnvio.email, conteudo, formularioId, clienteId, produtoId);
          } else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
              await this.whatsAppGateway.enviar(clienteParaEnvio.telefone, conteudo, formularioId, clienteId, produtoId );
          } else {
              throw new Error("Canal de envio inválido na campanha.");
          }
          envio.marcarComoEnviado();
        } catch (error: any) {
          envio.registrarFalha(error.message);
        }
      });

      await Promise.all(operacoesDeEnvio);
      await this.envioRepository.salvarVarios(lote);

      if (i + config.quantidade < enviosPendentes.length) {
        console.log(`Aguardando ${config.intervalo} horas para o próximo lote...`);
      }
    }

    console.log("Disparo em massa concluído.");
  }
}