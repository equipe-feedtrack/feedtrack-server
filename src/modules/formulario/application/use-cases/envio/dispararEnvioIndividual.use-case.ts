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

  public async execute(input: {campanhaId: string, vendaId: string, empresaId: string }): Promise<void> {
    const { campanhaId, empresaId, vendaId } = input;
    console.log(campanhaId, empresaId, vendaId);

    const empresa = await this.EmpresaRepository.findById(empresaId);
    if (!empresa) {
      throw new Error("Empresa não encontrado.");
    }
    const campanha = await this.campanhaRepository.recuperarPorUuid(campanhaId);
    if (!campanha) {
      throw new Error("Campanha não encontrada.");
    }

    const venda = await this.VendaRepository.findById(vendaId);
    if (!venda) {
      throw new Error("Venda não encontrada.");
    }


    // const formulario = await this.formularioRepository.recuperarPorUuid(campanha.formularioId);
    // if (!formulario) {
    //     throw new Error("Formulário não encontrado.");
    // }

    const envio = Envio.criar({
      campanhaId: campanhaId,
      empresaId: empresaId,
      vendaId: vendaId,
    });

try {
  console.log("CHEGOU AQUI")
  const conteudo = campanha.templateMensagem;
  console.log("[CANAL DE ENVIO]", campanha.canalEnvio)

const destinatarioEmail = venda.cliente?.email;
const destinatarioTelefone = venda.cliente?.telefone;


console.log("[Email]", destinatarioEmail); 
console.log("[WhatsApp]", destinatarioTelefone);


  if (campanha.canalEnvio === CanalEnvio.EMAIL) {
    if (!destinatarioEmail) {
      throw new Error("E-mail do cliente não fornecido.");
    }
    console.log("[Enviando por Email]", destinatarioEmail);
    await this.EmailGateway.enviar(destinatarioEmail, conteudo, vendaId, empresaId, campanhaId);
  } 
  else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
      console.log("[Enviando por WhatsApp]", destinatarioTelefone);
    if (!destinatarioTelefone) {
      throw new Error("Telefone do cliente não fornecido.");
    }
    
    console.log("[Enviando por WhatsApp]", destinatarioTelefone);
    await this.whatsAppGateway.enviar(destinatarioTelefone, conteudo, vendaId, empresaId, campanhaId);
  } 
  else {
    throw new Error("Canal de envio inválido na campanha.");
  }

  envio.marcarComoEnviado();
} catch (error: any) {
  envio.registrarFalha(error.message);
}


    await this.envioRepository.salvar(envio);
  }
}