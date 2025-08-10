"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispararEnvioIndividualUseCase = void 0;
const campanha_types_1 = require("@modules/campanha/domain/campanha.types");
const envio_entity_ts_1 = require("@modules/formulario/domain/envioformulario/envio.entity.ts");
class DispararEnvioIndividualUseCase {
    constructor(envioRepository, clienteRepository, campanhaRepository, formularioRepository, whatsAppGateway) {
        this.envioRepository = envioRepository;
        this.clienteRepository = clienteRepository;
        this.campanhaRepository = campanhaRepository;
        this.formularioRepository = formularioRepository;
        this.whatsAppGateway = whatsAppGateway;
    }
    async execute(input) {
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
        const envio = envio_entity_ts_1.Envio.criar({
            clienteId,
            campanhaId,
            formularioId: formulario.id,
            usuarioId,
        });
        try {
            const destinatarioTelefone = cliente.pessoa.telefone;
            const destinatarioEmail = cliente.pessoa.email;
            const conteudo = campanha.templateMensagem;
            const formulario = envio.formularioId;
            if (campanha.canalEnvio === campanha_types_1.CanalEnvio.EMAIL) {
                await enviarPorEmail(destinatarioEmail, conteudo, formulario);
            }
            else if (campanha.canalEnvio === campanha_types_1.CanalEnvio.WHATSAPP) {
                await this.whatsAppGateway.enviar(destinatarioTelefone, conteudo, formulario);
            }
            else {
                throw new Error("Canal de envio inválido na campanha.");
            }
            envio.marcarComoEnviado();
        }
        catch (error) {
            envio.registrarFalha(error.message);
        }
        await this.envioRepository.salvar(envio);
    }
}
exports.DispararEnvioIndividualUseCase = DispararEnvioIndividualUseCase;
//# sourceMappingURL=dispararEnvioIndividual.use-case.js.map