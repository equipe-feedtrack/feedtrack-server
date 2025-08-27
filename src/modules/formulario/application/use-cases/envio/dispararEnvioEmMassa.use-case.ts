import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { IEmpresaRepository } from "@modules/empresa/infra/empresa.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity";
import { IEmailGateway, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IVendaRepository } from "@modules/venda/infra/venda.repository.interface";
import { CanalEnvio } from "@prisma/client";

export class DispararEnvioEmMassaRealtimeUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly vendaRepository: IVendaRepository,
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly whatsAppGateway: IWhatsAppGateway,
    private readonly EmailGateway: IEmailGateway,
    private readonly EmpresaRepository: IEmpresaRepository
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

  private normalizarTelefone(telefone: string): string {
    return telefone.replace(/\D/g, "");
  }

  public async execute(
    campanhaId: string,
    empresaId: string,
    produtoId: string
  ): Promise<void> {
    const empresa = await this.EmpresaRepository.findById(empresaId);
    if (!empresa) throw new Error("Empresa não encontrada.");

    const campanha = await this.campanhaRepository.recuperarPorUuid(campanhaId, empresaId);
    if (!campanha) throw new Error("Campanha não encontrada.");

    console.log(`Iniciando disparo em tempo real para campanha ${campanhaId}.`);

    const vendas = await this.vendaRepository.buscarNovasVendas(empresaId, produtoId);

    for (const venda of vendas) {
      const jaExisteEnvio = await this.envioRepository.checarSeEnvioJaFoiFeito(campanhaId, venda.id);
      if (jaExisteEnvio) continue;

      const envio = Envio.criar({ campanhaId, empresaId, vendaId: venda.id });

      try {
        const conteudoFinal = this.substituirPlaceholders(campanha.templateMensagem ?? '', {
          nomeCliente: venda.cliente?.nome ?? "Cliente",
          nomeProduto: venda.produto?.map(e => e.nome).join(", ") ?? "Produto",
          nomeEmpresa: empresa.props.nome ?? "Empresa",
        });

        const destinatarioEmail = venda.cliente?.email;
        const destinatarioTelefone = venda.cliente?.telefone;

        if (campanha.canalEnvio === CanalEnvio.EMAIL) {
          if (!destinatarioEmail) throw new Error("E-mail do cliente não fornecido.");
          await this.EmailGateway.enviar(destinatarioEmail, conteudoFinal, venda.id, empresaId, campanhaId);
        } else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
          if (!destinatarioTelefone) throw new Error("Telefone do cliente não fornecido.");
          await this.whatsAppGateway.enviar(this.normalizarTelefone(destinatarioTelefone), conteudoFinal, venda.id, empresaId, campanhaId);
        } else {
          throw new Error("Canal de envio inválido na campanha.");
        }

        envio.marcarComoEnviado();
      } catch (error: any) {
        envio.registrarFalha(error.message);
      }

      await this.envioRepository.salvar(envio);
    }

    console.log("Disparo em massa concluído.");
  }
}
