"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IniciarEnvioFormularioUseCase = void 0;
const envio_entity_ts_1 = require("@modules/formulario/domain/envioformulario/domain/envio.entity.ts");
const use_case_exception_1 = require("@shared/application/use-case/use-case.exception");
class IniciarEnvioFormularioUseCase {
    constructor(envioRepository, whatsAppGateway, feedbackService, clienteRepository) {
        this.envioRepository = envioRepository;
        this.whatsAppGateway = whatsAppGateway;
        this.feedbackService = feedbackService;
        this.clienteRepository = clienteRepository;
    }
    async execute(dto) {
        // 1. Busca o cliente para obter o número de telefone (destinatário)
        const cliente = await this.clienteRepository.buscarPorId(dto.clienteId);
        if (!cliente || !cliente.pessoa.telefone) { // Supondo que a entidade Cliente tenha um campo 'telefone'
            throw new use_case_exception_1.UseCaseException('Cliente ou número de telefone não encontrado.');
        }
        const destinatario = cliente.pessoa.telefone;
        // 2. Comunica com o subdomínio 'feedback' para gerar um ID de coleta.
        const feedbackId = await this.feedbackService.iniciarColeta(dto.formularioId, dto.clienteId);
        // 3. Cria a entidade de 'Envio'.
        const envio = envio_entity_ts_1.Envio.criar({
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
        }
        catch (error) {
            envio.marcarComoFalha(error.message);
        }
        // 7. Salva o estado final (ENVIADO ou FALHA).
        await this.envioRepository.salvar(envio);
        return envio.id;
    }
}
exports.IniciarEnvioFormularioUseCase = IniciarEnvioFormularioUseCase;
//# sourceMappingURL=IniciarEnvioFormularioUseCase.js.map