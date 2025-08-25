// src/modules/venda/infra/http/routes/venda.routes.ts
import { Router } from "express";
import { VendaController } from "./controller/venda.controller";
import { VendaRepositoryPrisma } from "../infra/venda.repository.prisma";
import { RecuperarVendaPorIdUseCase } from "../application/use-cases/recuperar-venda-por-id.use-case";
import { RecuperarTodasVendasUseCase } from "../application/use-cases/recuperar-todas-vendas.use-case";
import { CriarVendaUseCase } from "../application/use-cases/criarVendaUseCase";
import { authMiddleware } from "@shared/presentation/http/middlewares/validation.middleware";
import { DeletarVendaUseCase } from "../application/use-cases/deletarVendaUseCase";

const vendaRoutes = Router();

// Instâncias do repositório e use cases
const repository = new VendaRepositoryPrisma();
const criarVendaUseCase = new CriarVendaUseCase(repository);
const recuperarVendaPorIdUseCase = new RecuperarVendaPorIdUseCase(repository);
const recuperarTodasVendasUseCase = new RecuperarTodasVendasUseCase(repository);
const deletarVendaUseCase = new DeletarVendaUseCase(repository);

// Controller com todos os use cases
const vendaController = new VendaController(
  criarVendaUseCase,
  recuperarVendaPorIdUseCase,
  recuperarTodasVendasUseCase,
  deletarVendaUseCase
);

// Rotas
vendaRoutes.post(
  "/venda",
  authMiddleware,
  vendaController.create.bind(vendaController)
); // criar venda

vendaRoutes.get("/venda/:id", vendaController.findById.bind(vendaController)); // buscar por id
vendaRoutes.get(
  "/vendas",
  authMiddleware,
  vendaController.findAll.bind(vendaController)
); // listar todas


vendaRoutes.delete("/venda/:id/:empresaId", authMiddleware, (req, res) =>
  vendaController.delete(req, res)
);

export { vendaRoutes };
