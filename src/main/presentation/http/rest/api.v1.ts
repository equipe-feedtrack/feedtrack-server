import produtoRouter from "@modules/produtos/presentation/produto.routes";
import Express, { Router } from "express";

const apiv1Router: Router = Express.Router();

apiv1Router.use(
    '/pergunta',
    function (request, response, next) {
        response.json({'entidade':'Pergunta'});
    }
);

apiv1Router.use(
    '/formulario',
    function (request, response, next) {
        response.json({'entidade':'Formulario'});
    }
);

apiv1Router.use(
    '/envioFormulario',
    function (request, response, next) {
        response.json({'entidade':'Envio'});
    }
);

apiv1Router.use('/produto',produtoRouter);

export{ apiv1Router }