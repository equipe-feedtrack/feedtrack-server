import { Router } from "express";
import { VendaController } from "./controller/venda.controller";

const vendaRoutes = Router();
const vendaController = new VendaController();

vendaRoutes.post("/venda", vendaController.create);

export { vendaRoutes };
