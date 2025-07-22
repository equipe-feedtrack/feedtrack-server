/*
  Warnings:

  - You are about to drop the `produtos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "produtos";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL,
    "dataExclusao" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ATIVO'
);
