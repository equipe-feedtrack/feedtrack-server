"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvioController = void 0;
class EnvioController {
    constructor(dispararEnvioIndividualUseCase, dispararEnvioEmMassaUseCase, retentarEnviosPendentesUseCase) {
        this.dispararEnvioIndividualUseCase = dispararEnvioIndividualUseCase;
        this.dispararEnvioEmMassaUseCase = dispararEnvioEmMassaUseCase;
        this.retentarEnviosPendentesUseCase = retentarEnviosPendentesUseCase;
        /**
         * @description Manipulador para disparar um envio individual de um formulário.
         * Rota: POST /envios/individual
         */
        this.dispararIndividual = async (req, res, next) => {
            try {
                const { clienteId, campanhaId, usuarioId } = req.body;
                await this.dispararEnvioIndividualUseCase.execute({ clienteId, campanhaId, usuarioId });
                res.status(200).json({ message: 'Envio individual disparado com sucesso.' });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description Manipulador para disparar um envio em massa de um formulário.
         * Rota: POST /envios/massa
         */
        this.dispararEmMassa = async (req, res, next) => {
            try {
                const { campanhaId, quantidade, intervalo } = req.body;
                await this.dispararEnvioEmMassaUseCase.execute(campanhaId, { quantidade, intervalo });
                res.status(200).json({ message: 'Disparo em massa iniciado com sucesso.' });
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * @description Manipulador para retentar envios pendentes (usado por jobs).
         * Rota: POST /envios/retentar
         */
        this.retentarPendentes = async (req, res, next) => {
            try {
                await this.retentarEnviosPendentesUseCase.execute();
                res.status(200).json({ message: 'Retentativa de envios pendentes concluída.' });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.EnvioController = EnvioController;
//# sourceMappingURL=envio.controller.js.map