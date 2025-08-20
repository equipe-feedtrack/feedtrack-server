import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { IEmpresaRepository } from "@modules/empresa/infra/empresa.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity";
import { IEmailGateway, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IVendaRepository } from "@modules/venda/infra/venda.repository.interface";
import { CanalEnvio } from "@prisma/client";




async function enviarPorEmail(email: string, conteudo: string, formulario: string): Promise<void> {
    console.log(`Enviando e-mail para ${email} com conteúdo: ${conteudo} e formulário: ${formulario}`);
    // Simulate email sending
    return Promise.resolve();
}

export class DispararEnvioIndividualUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly whatsAppGateway: IWhatsAppGateway,
    private readonly EmailGateway: IEmailGateway,
    private readonly EmpresaRepository: IEmpresaRepository,
    private readonly VendaRepository: IVendaRepository
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

  public async execute(input: { campanhaId: string; vendaId: string; empresaId: string }): Promise<void> {
    const { campanhaId, empresaId, vendaId } = input;

    const empresa = await this.EmpresaRepository.findById(empresaId);
    if (!empresa) throw new Error("Empresa não encontrada.");

    const campanha = await this.campanhaRepository.recuperarParcial(campanhaId, empresaId);
    if (!campanha) throw new Error("Campanha não encontrada.");

    const venda = await this.VendaRepository.findById(vendaId);
    if (!venda) throw new Error("Venda não encontrada.");

    const envio = Envio.criar({ campanhaId, empresaId, vendaId });

    try {
      // Substituir placeholders
      const conteudoFinal = this.substituirPlaceholders(campanha.templateMensagem ?? '', {
        nomeCliente: venda.cliente?.nome ?? "Cliente",
        nomeProduto: venda.produto?.nome ?? "Produto",
        nomeEmpresa: empresa.props.nome ?? "Empresa",
      });

      const destinatarioEmail = venda.cliente?.email;
      const destinatarioTelefone = venda.cliente?.telefone;

      if (campanha.canalEnvio === CanalEnvio.EMAIL) {
        if (!destinatarioEmail) throw new Error("E-mail do cliente não fornecido.");
        await this.EmailGateway.enviar(destinatarioEmail, conteudoFinal, vendaId, empresaId, campanhaId);
      } else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
        if (!destinatarioTelefone) throw new Error("Telefone do cliente não fornecido.");
        await this.whatsAppGateway.enviar(destinatarioTelefone, conteudoFinal, vendaId, empresaId, campanhaId);
      } else {
        throw new Error("Canal de envio inválido na campanha.");
      }

      envio.marcarComoEnviado();
    } catch (error: any) {
      envio.registrarFalha(error.message);
    }

    await this.envioRepository.salvar(envio);
  }
}
