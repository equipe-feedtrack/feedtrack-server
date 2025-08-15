import { Router } from "express";
import { EmpresaController } from "./controller/empresa.controller";

const empresaRoutes = Router();
const empresaController = new EmpresaController();

empresaRoutes.post("/empresa", empresaController.create);

empresaRoutes.get("/empresas", empresaController.getAll);

empresaRoutes.get("/empresa/:id", empresaController.getById);

export { empresaRoutes };
