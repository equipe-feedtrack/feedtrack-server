"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiv1Router = void 0;
const campanha_routes_1 = require("@modules/campanha/presentation/campanha.routes");
const feedback_routes_1 = require("@modules/feedbacks/presentation/feedback.routes");
const formulario_routes_1 = require("@modules/formulario/presentation/formulario.routes");
const pergunta_routes_1 = require("@modules/formulario/presentation/pergunta.routes");
const gestao_clientes_routes_1 = require("@modules/gestao_clientes/presentation/gestao_clientes.routes");
const produto_routes_1 = __importDefault(require("@modules/produtos/presentation/produto.routes"));
const express_1 = __importDefault(require("express"));
const apiv1Router = express_1.default.Router();
exports.apiv1Router = apiv1Router;
apiv1Router.use(produto_routes_1.default);
apiv1Router.use(gestao_clientes_routes_1.clienteRouter);
apiv1Router.use(pergunta_routes_1.perguntaRouter);
apiv1Router.use(formulario_routes_1.formularioRouter);
apiv1Router.use(campanha_routes_1.campanhaRouter);
//desejável observações para fazer também (Yago)
// apiv1Router.use(envio) Falta fazer
//apiv1Router.use(acesso_e_identidade) falta fazer
apiv1Router.use(feedback_routes_1.feedbackRoutes);
//# sourceMappingURL=api.v1.js.map