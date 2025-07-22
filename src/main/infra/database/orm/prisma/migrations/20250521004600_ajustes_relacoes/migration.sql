/*
  Warnings:

  - Added the required column `cidade` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAtualizacao` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendedorResponsavel` to the `clientes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL,
    "dataExclusao" DATETIME,
    "vendedorResponsavel" TEXT NOT NULL
);
INSERT INTO "new_clientes" ("id", "nome", "telefone") SELECT "id", "nome", "telefone" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
CREATE TABLE "new_produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL,
    "dataExclusao" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "clienteId" INTEGER,
    CONSTRAINT "produto_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_produto" ("dataAtualizacao", "dataCriacao", "dataExclusao", "descricao", "id", "nome", "status", "valor") SELECT "dataAtualizacao", "dataCriacao", "dataExclusao", "descricao", "id", "nome", "status", "valor" FROM "produto";
DROP TABLE "produto";
ALTER TABLE "new_produto" RENAME TO "produto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
