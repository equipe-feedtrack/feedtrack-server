import { Router } from 'express';
import { RecuperacaoSenhaController } from './controller/recuperacao-senha.controller';

const recuperacaoRoutes = Router();

const recuperacaoSenhaController = new RecuperacaoSenhaController();

recuperacaoRoutes.post(
  '/solicitar',
  recuperacaoSenhaController.solicitar,
);

recuperacaoRoutes.post(
  '/confirmar',
  recuperacaoSenhaController.confirmar,
);

export { recuperacaoRoutes };
