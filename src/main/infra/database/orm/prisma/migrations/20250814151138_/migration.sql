/*
  Warnings:

  - You are about to drop the column `vendedor_responsavel` on the `clientes` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "cidade" TEXT,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_clientes" ("cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "empresaId", "id", "nome", "status", "telefone") SELECT "cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "empresaId", "id", "nome", "status", "telefone" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
