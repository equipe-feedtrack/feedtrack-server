/*
  Warnings:

  - You are about to drop the `feedbacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "feedbacks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "respostas" JSONB NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_exclusao" DATETIME,
    "cliente_nome" TEXT,
    "produto_nome" TEXT,
    "funcionario_nome" TEXT,
    "empresaId" TEXT NOT NULL,
    "formulario_id" TEXT,
    "envio_id" TEXT,
    CONSTRAINT "Feedback_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Feedback_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Feedback_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "envios_formulario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_envio_id_key" ON "Feedback"("envio_id");
