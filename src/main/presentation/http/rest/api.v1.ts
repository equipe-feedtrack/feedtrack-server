import produtoRouter from "@modules/produtos/presentation/produto.routes";
import  { Router } from "express";

const feedtrackRouter: Router = Router();

feedtrackRouter.use(
    '/pergunta',
    function (request, response, next) {
        response.json({'entidade':'Pergunta'});
    }
);

feedtrackRouter.use(
    '/formulario',
    function (request, response, next) {
        response.json({'entidade':'Formulario'});
    }
);

feedtrackRouter.use(
    '/envioFormulario',
    function (request, response, next) {
        response.json({'entidade':'Envio'});
    }
);

feedtrackRouter.use('/produtos', produtoRouter);


export  { feedtrackRouter }