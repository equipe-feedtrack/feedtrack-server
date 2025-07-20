
import { Envio } from "@modules/formulario/domain/envioformulario/domain/envio.entity.ts";
import { IClienteRepository, IEnvioRepository, IFeedbackService, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { UseCaseException } from "@shared/application/use-case/use-case.exception";
import { IniciarEnvioDTO } from "../dto/envio/iniciarEnvioDTO";

export class IniciarEnvioFormularioUseCase {
  constructor(
    private readonly envioRepository: IEnvioRepository,
    private readonly whatsAppGateway: IWhatsAppGateway,
    private readonly feedbackService: IFeedbackService,
    private readonly clienteRepository: IClienteRepository, // Para buscar o telefone
  ) {}

  async execute(dto: IniciarEnvioDTO): Promise<string> {
    // 1. Busca o cliente para obter o número de telefone (destinatário)
    const cliente = await this.clienteRepository.buscarPorId(dto.clienteId);
    if (!cliente || !cliente.pessoa.telefone) { // Supondo que a entidade Cliente tenha um campo 'telefone'
        throw new UseCaseException('Cliente ou número de telefone não encontrado.');
    }
    const destinatario = cliente.pessoa.telefone;

    // 2. Comunica com o subdomínio 'feedback' para gerar um ID de coleta.
    const feedbackId = await this.feedbackService.iniciarColeta(dto.formularioId, dto.clienteId);

    // 3. Cria a entidade de 'Envio'.
    const envio = Envio.criar({
      clienteId: dto.clienteId,
      usuarioId: dto.usuarioId,
      formularioId: dto.formularioId,
      feedbackId: feedbackId,
    });

    // 4. Salva o estado inicial (PENDENTE).
    await this.envioRepository.salvar(envio);
    
    // 5. Monta a mensagem.
    const link = `https://seusistema.com/feedback/${envio.feedbackId}`;
    const conteudo = `Olá! Gostaríamos do seu feedback. Por favor, aceda a este link: ${link}`;

    try {
      // 6. Tenta enviar a mensagem.
      await this.whatsAppGateway.enviar(destinatario, conteudo);
      envio.marcarComoEnviado();
    } catch (error: any) {
      envio.marcarComoFalha(error.message);
    }

    // 7. Salva o estado final (ENVIADO ou FALHA).
    await this.envioRepository.salvar(envio);

    return envio.id;
  }
}