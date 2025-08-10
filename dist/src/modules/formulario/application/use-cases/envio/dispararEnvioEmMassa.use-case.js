"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispararEnvioEmMassaUseCase = void 0;
const campanha_types_1 = require("@modules/campanha/domain/campanha.types");
const envio_entity_ts_1 = require("@modules/formulario/domain/envioformulario/envio.entity.ts");
/**
 * @description Use Case para disparar Envios de formulário em massa.
 * Ele recupera clientes, cria entidades de Envio e as envia em lotes.
 */
class DispararEnvioEmMassaUseCase {
    constructor(envioRepository, clienteRepository, campanhaRepository, whatsAppGateway) {
        this.envioRepository = envioRepository;
        this.clienteRepository = clienteRepository;
        this.campanhaRepository = campanhaRepository;
        this.whatsAppGateway = whatsAppGateway;
    }
    async execute(campanhaId, config) {
        const campanha = await this.campanhaRepository.recuperarPorUuid(campanhaId);
        if (!campanha) {
            throw new Error("Campanha não encontrada.");
        }
        const clientes = await this.clienteRepository.buscarClientesParaCampanha(campanha.segmentoAlvo);
        let enviosPendentes = [];
        for (const cliente of clientes) {
            const envio = envio_entity_ts_1.Envio.criar({
                clienteId: cliente.id,
                campanhaId: campanha.id,
                formularioId: campanha.formularioId,
                usuarioId: "system-user-uuid",
            });
            enviosPendentes.push(envio);
        }
        console.log(`Iniciando disparo em massa para ${enviosPendentes.length} clientes. Lote: ${config.quantidade}, Intervalo: ${config.intervalo}h`);
        for (let i = 0; i < enviosPendentes.length; i += config.quantidade) {
            const lote = enviosPendentes.slice(i, i + config.quantidade);
            console.log(`Processando lote de ${lote.length} envios.`);
            const operacoesDeEnvio = lote.map(async (envio) => {
                try {
                    // Lógica de envio por e-mail ou WhatsApp com base na Campanha
                    const conteudo = campanha.templateMensagem;
                    const formulario = envio.campanhaId;
                    const link = `https://localhost:3000/${envio.feedbackId}`; // VINCULAR O LINK REAL QUE IRÁ GERAR A PÁGINA DE FEEDBACK'
                    const clienteParaEnvio = clientes.find(c => c.id === envio.clienteId);
                    if (!clienteParaEnvio) {
                        envio.registrarFalha(`Cliente com ID ${envio.clienteId} não encontrado na lista de clientes da campanha.`);
                        return; // Pula para o próximo item do array
                    }
                    if (campanha.canalEnvio === campanha_types_1.CanalEnvio.EMAIL) {
                        await enviarPorEmail(clienteParaEnvio.pessoa.email, conteudo, formulario);
                    }
                    else if (campanha.canalEnvio === campanha_types_1.CanalEnvio.WHATSAPP) {
                        await this.whatsAppGateway.enviar(clienteParaEnvio.pessoa.telefone, conteudo, formulario, link);
                    }
                    else {
                        throw new Error("Canal de envio inválido na campanha.");
                    }
                    envio.marcarComoEnviado();
                }
                catch (error) {
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
exports.DispararEnvioEmMassaUseCase = DispararEnvioEmMassaUseCase;
//# sourceMappingURL=dispararEnvioEmMassa.use-case.js.map