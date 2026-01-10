import { Router } from "express";
import { EmpresaController } from "./controller/empresa.controller";
import { authMiddleware } from "@shared/presentation/http/middlewares/validation.middleware";

const empresaRoutes = Router();
const empresaController = new EmpresaController();

empresaRoutes.post("/empresa", empresaController.create);

empresaRoutes.get("/empresas", empresaController.getAll);

empresaRoutes.get("/empresa/:id", empresaController.getById);

empresaRoutes.patch("/empresa/:id", authMiddleware, empresaController.update);

empresaRoutes.delete("/empresa/:id", authMiddleware, empresaController.delete);

export { empresaRoutes };
