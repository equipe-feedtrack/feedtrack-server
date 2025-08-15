/*
  Warnings:

  - Added the required column `pessoaId` to the `clientes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "vendedor_responsavel" TEXT NOT NULL,
    "cidade" TEXT,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "pessoaId" TEXT NOT NULL,
    CONSTRAINT "clientes_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_clientes" ("cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome", "status", "telefone", "vendedor_responsavel") SELECT "cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome", "status", "telefone", "vendedor_responsavel" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
CREATE UNIQUE INDEX "clientes_pessoaId_key" ON "clientes"("pessoaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
