import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { IEmailGateway, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IVendaRepository } from "@modules/venda/infra/venda.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity";
import { CanalEnvio } from "@prisma/client";

export interface DisparoEmMassaRealtimeConfig {
  intervaloChecagemMinutos: number; // quanto tempo esperar entre cada verificação de novas vendas
}

/**
 * @description Dispara mensagens automaticamente para cada nova venda enquanto a campanha estiver ativa.
 */
export class DispararEnvioEmMassaRealtimeUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly vendaRepository: IVendaRepository,
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly whatsAppGateway: IWhatsAppGateway,
    private readonly EmailGateway: IEmailGateway
  ) {}

  private substituirPlaceholders(template: string, dados: {
    nomeCliente?: string;
    nomeProduto?: string;
    nomeEmpresa?: string;
  }): string {
    return template
      .replace(/\[Nome do Cliente\]/g, `*${dados.nomeCliente ?? ''}*`)
      .replace(/\[Nome do Produto\]/g, `*${dados.nomeProduto ?? ''}*`)
      .replace(/\[Nome da Empresa\]/g, `*${dados.nomeEmpresa ?? ''}*`);
  }

  public async execute(
    campanhaId: string,
    empresaId: string,
    produtoId: string,
    config: DisparoEmMassaRealtimeConfig
  ): Promise<void> {

    const campanha = await this.campanhaRepository.recuperarPorUuid(campanhaId, empresaId);
    if (!campanha) throw new Error("Campanha não encontrada.");

    console.log(`Iniciando disparo em tempo real para campanha ${campanhaId}.`);

    // Mantém registro de vendas já enviadas
    const vendasEnviadas = new Set<string>();

    while (!campanha.dataFim || new Date() < campanha.dataFim) {
      // Buscar vendas novas
      const vendas = await this.vendaRepository.buscarNovasVendas(empresaId, produtoId);

      for (const venda of vendas) {
        if (vendasEnviadas.has(venda.id)) continue; // evita duplicidade

        const envio = Envio.criar({ campanhaId, empresaId, vendaId: venda.id });

        try {
          const conteudoFinal = this.substituirPlaceholders(campanha.templateMensagem, {
            nomeCliente: venda.cliente?.nome ?? "Cliente",
            nomeProduto: venda.produto?.nome ?? "Produto",
            nomeEmpresa: venda.empresa?.nome ?? "Empresa",
          });

          if (campanha.canalEnvio === CanalEnvio.EMAIL) {
            if (!venda.cliente?.email) throw new Error("Email do cliente não fornecido.");
            await this.EmailGateway.enviar(venda.cliente.email, conteudoFinal, venda.id, venda.clienteId, produtoId);
          } else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
            if (!venda.cliente?.telefone) throw new Error("Telefone do cliente não fornecido.");
            await this.whatsAppGateway.enviar(venda.cliente.telefone, conteudoFinal, venda.id, venda.clienteId, produtoId);
          } else {
            throw new Error("Canal de envio inválido na campanha.");
          }

          envio.marcarComoEnviado();
          vendasEnviadas.add(venda.id);

        } catch (error: any) {
          envio.registrarFalha(error.message);
        }

        await this.envioRepository.salvar(envio);
      }

      // Espera o intervalo definido antes de buscar novas vendas
      await new Promise(res => setTimeout(res, config.intervaloChecagemMinutos * 60 * 1000));
    }

    console.log("Campanha finalizada, disparo em tempo real encerrado.");
  }
}
