import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { IEmailGateway, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { CanalEnvio } from "@prisma/client";
/**
 * @description Use Case para retentar o envio de formulários que estão com o status PENDENTE ou FALHA.
 * Este use case é ideal para ser executado por um scheduler (job).
 */
export class RetentarEnviosPendentesUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly emailGateway: IEmailGateway,
    private readonly whatsappGateway: IWhatsAppGateway,
  ) {}

  public async execute(input?: { clienteId?: string, campanhaId?: string }): Promise<void> {
    let enviosPendentes: Envio[];

    if (input?.clienteId) {
      enviosPendentes = await this.envioRepository.buscarPendentesPorCliente(input.clienteId);
    } else if (input?.campanhaId) {
      enviosPendentes = await this.envioRepository.buscarPendentesPorCampanha(input.campanhaId);
    } else {
      enviosPendentes = await this.envioRepository.buscarPendentes();
    }

    if (enviosPendentes.length === 0) {
      console.log('Nenhum envio pendente para retentar.');
      return;
    }

    console.log(`Retentando ${enviosPendentes.length} envios pendentes.`);

    const operacoes = enviosPendentes.map(async (envio) => {
      try {
        const campanha = await this.campanhaRepository.recuperarPorUuid(envio.campanhaId);
        if (!campanha) {
          envio.registrarFalha(`Campanha com ID ${envio.campanhaId} não encontrada.`);
          return;
        }

        const cliente = await this.clienteRepository.recuperarPorUuid(envio.clienteId);
        if (!cliente) {
          envio.registrarFalha(`Cliente com ID ${envio.clienteId} não encontrado.`);
          return;
        }

        if (campanha.canalEnvio === CanalEnvio.EMAIL) {
          await this.emailGateway.enviar(cliente.pessoa.email, campanha.templateMensagem, envio.formularioId, envio.clienteId);
        } else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
          await this.whatsappGateway.enviar(cliente.pessoa.telefone, campanha.templateMensagem, envio.formularioId, envio.clienteId);
        } else {
          envio.registrarFalha('Canal de envio inválido na campanha.');
          return;
        }

        envio.marcarComoEnviado();
      } catch (error: any) {
        envio.registrarFalha(error.message);
      }
      return envio;
    });

    const enviosAtualizados = (await Promise.all(operacoes)).filter((envio): envio is Envio => !!envio);
    await this.envioRepository.salvarVarios(enviosAtualizados);
  }
}
