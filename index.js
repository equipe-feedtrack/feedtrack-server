import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Servir arquivo estático (feedback.html)
app.get("/feedback/formulario/:formularioId/cliente/:clienteId", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API para buscar dados do Prisma
app.get(
  "/api/feedback/formulario/:formularioId/cliente/:clienteId",
  async (req, res) => {
    const { formularioId, clienteId } = req.params;

    try {
      const formulario = await prisma.envioFormulario.findUnique({
        where: { id: formularioId },
        include: {
          envios: {
            where: { clienteId },
            include: {
              cliente: true,
              campanha: true,
              usuario: true,
              feedback: true,
            },
          },
        },
      });

      if (!formulario) {
        return res.status(404).json({ message: "Formulário não encontrado" });
      }

      res.json(formulario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  }
);

app.listen(3002, () => {
  console.log("Servidor rodando na porta 3000");
});

[
  {
    perguntaId: "fa4b3ae6-01cc-410e-a7cb-cebf23455d2c",
    tipo: "texto",
    data_resposta: "2025-08-10T05:10:19.944Z",
    resposta_texto: "Gostei",
  },
  {
    perguntaId: "397e1806-9cc3-4eb6-9919-592f4140e49d",
    tipo: "nota",
    data_resposta: "2025-08-10T05:10:19.944Z",
    nota: 1,
  },
];
