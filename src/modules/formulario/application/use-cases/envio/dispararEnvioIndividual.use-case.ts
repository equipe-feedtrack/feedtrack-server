import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { IEmailGateway, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { IClienteRepository } from "@modules/gestao_clientes/infra/cliente.repository.interface";
import { CanalEnvio } from "@prisma/client";

export class DispararEnvioIndividualUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly formularioRepository: IFormularioRepository<Formulario>,
    private readonly whatsAppGateway: IWhatsAppGateway,
     private readonly EmailGateway: IEmailGateway,
  ) {}

  public async execute(input: { clienteId: string, campanhaId: string, usuarioId: string }): Promise<void> {
    const { clienteId, campanhaId, usuarioId } = input;

    const cliente = await this.clienteRepository.recuperarPorUuid(clienteId);
    if (!cliente) {
      throw new Error("Cliente não encontrado.");
    }
    const campanha = await this.campanhaRepository.recuperarPorUuid(campanhaId);
    if (!campanha) {
      throw new Error("Campanha não encontrada.");
    }
    const formulario = await this.formularioRepository.recuperarPorUuid(campanha.formularioId);
    if (!formulario) {
        throw new Error("Formulário não encontrado.");
    }

    const envio = Envio.criar({
      clienteId,
      campanhaId,
      formularioId: formulario.id,
      usuarioId,
    });

    try {
        const destinatarioTelefone = cliente.pessoa.telefone;
        const destinatarioEmail = cliente.pessoa.email;
        const conteudo = campanha.templateMensagem;
        const campanhaId = envio.campanhaId;

      if (campanha.canalEnvio === CanalEnvio.EMAIL) {
        if (!destinatarioEmail) {
            throw new Error("E-mail do cliente não fornecido.");
        }
        await this.EmailGateway.enviar(destinatarioEmail, conteudo, campanhaId);

      } else if (campanha.canalEnvio === CanalEnvio.WHATSAPP) {
        if (!destinatarioTelefone) {
            throw new Error("Telefone do cliente não fornecido.");
        }
        await this.whatsAppGateway.enviar(destinatarioTelefone, conteudo, campanhaId);

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