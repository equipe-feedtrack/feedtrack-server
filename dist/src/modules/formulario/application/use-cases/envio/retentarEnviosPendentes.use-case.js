"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetentarEnviosPendentesUseCase = void 0;
/**
 * @description Use Case para retentar o envio de formulários que estão com o status PENDENTE ou FALHA.
 * Este use case é ideal para ser executado por um scheduler (job).
 */
class RetentarEnviosPendentesUseCase {
    constructor(envioRepository) {
        this.envioRepository = envioRepository;
    }
    async execute() {
        const enviosPendentes = await this.envioRepository.buscarPendentes(); // Este método precisa ser adicionado ao repositório
        if (enviosPendentes.length === 0) {
            console.log("Nenhum envio pendente para retentar.");
            return;
        }
        console.log(`Retentando ${enviosPendentes.length} envios pendentes.`);
        const operacoes = enviosPendentes.map(async (envio) => {
            try {
                console.log(`Simulando retentativa de envio para ${envio.clienteId}`);
                // Lógica de retentativa aqui
                envio.marcarComoEnviado();
            }
            catch (error) {
                envio.registrarFalha(error.message);
            }
            return envio;
        });
        const enviosAtualizados = await Promise.all(operacoes);
        await this.envioRepository.salvarVarios(enviosAtualizados);
    }
}
exports.RetentarEnviosPendentesUseCase = RetentarEnviosPendentesUseCase;
//# sourceMappingURL=retentarEnviosPendentes.use-case.js.map