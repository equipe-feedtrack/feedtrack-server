import { Router } from "express";
import { EmpresaController } from "./controller/empresa.controller";
import { authenticateToken } from "@shared/presentation/http/middlewares/validation.middleware";

const empresaRoutes = Router();
const empresaController = new EmpresaController();

empresaRoutes.post("/empresa", empresaController.create);

empresaRoutes.get("/empresas", authenticateToken, empresaController.getAll);

empresaRoutes.get("/empresa/:id", authenticateToken, empresaController.getById);

empresaRoutes.patch("/empresa/:id", authenticateToken, empresaController.update);

empresaRoutes.delete("/empresa/:id", authenticateToken, empresaController.delete);

export { empresaRoutes };
