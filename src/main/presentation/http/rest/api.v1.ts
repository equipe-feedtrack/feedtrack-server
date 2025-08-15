import { funcionarioRouter } from "@modules/acesso_e_identidade/presentation/funcionario.routes";
import { usuarioRouter } from "@modules/acesso_e_identidade/presentation/usuario.routes";
import { authRouter } from "@modules/acesso_e_identidade/presentation/auth.routes"; // Added
import { campanhaRouter } from "@modules/campanha/presentation/campanha.routes";
import { feedbackRoutes } from "@modules/feedbacks/presentation/feedback.routes";
import { envioRouter } from "@modules/formulario/presentation/envio.routes";
import { formularioRouter } from "@modules/formulario/presentation/formulario.routes";
import { perguntaRouter } from "@modules/formulario/presentation/pergunta.routes";
import { clienteRouter } from "@modules/gestao_clientes/presentation/gestao_clientes.routes";
import produtoRouter from "@modules/produtos/presentation/produto.routes";
import { empresaRoutes } from "@modules/empresa/presentation/empresa.routes";
import Express, { Router } from "express";
import { vendaRoutes } from "@modules/venda/presentation/venda.routes";

const apiv1Router: Router = Express.Router();

//apiv1Router.use(acesso_e_identidade) falta fazer

apiv1Router.use(produtoRouter);

apiv1Router.use(clienteRouter);

apiv1Router.use(perguntaRouter);

apiv1Router.use(formularioRouter);

apiv1Router.use(campanhaRouter);

apiv1Router.use(envioRouter);

apiv1Router.use(feedbackRoutes);

apiv1Router.use(funcionarioRouter)

apiv1Router.use(usuarioRouter)

apiv1Router.use(authRouter); // Added

apiv1Router.use(empresaRoutes);

apiv1Router.use(vendaRoutes)



//desejável observações para fazer também (Yago)


export{ apiv1Router }