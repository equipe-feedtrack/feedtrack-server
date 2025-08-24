// src/modules/venda/infra/http/routes/venda.routes.ts
import { Router } from "express";
import { VendaController } from "./controller/venda.controller";
import { VendaRepositoryPrisma } from "../infra/venda.repository.prisma"; 
import { RecuperarVendaPorIdUseCase } from "../application/use-cases/recuperar-venda-por-id.use-case";
import { RecuperarTodasVendasUseCase } from "../application/use-cases/recuperar-todas-vendas.use-case"; 
import { CriarVendaUseCase } from "../application/use-cases/criarVendaUseCase"; 
import { authenticateToken } from "@shared/presentation/http/middlewares/validation.middleware";

const vendaRoutes = Router();

// Instâncias do repositório e use cases
const repository = new VendaRepositoryPrisma();
const criarVendaUseCase = new CriarVendaUseCase(repository);
const recuperarVendaPorIdUseCase = new RecuperarVendaPorIdUseCase(repository);
const recuperarTodasVendasUseCase = new RecuperarTodasVendasUseCase(repository);

// Controller com todos os use cases
const vendaController = new VendaController(
  criarVendaUseCase,
  recuperarVendaPorIdUseCase,
  recuperarTodasVendasUseCase
);

// Rotas
vendaRoutes.post("/venda", authenticateToken, vendaController.create.bind(vendaController)); // criar venda
vendaRoutes.get("/venda/:id", authenticateToken, vendaController.findById.bind(vendaController)); // buscar por id
vendaRoutes.get("/vendas", authenticateToken, vendaController.findAll.bind(vendaController)); // listar todas

export { vendaRoutes };
