/*
  Warnings:

  - Added the required column `empresa_id` to the `formularios` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_formularios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);
INSERT INTO "new_formularios" ("ativo", "data_atualizacao", "data_criacao", "data_exclusao", "descricao", "id", "titulo") SELECT "ativo", "data_atualizacao", "data_criacao", "data_exclusao", "descricao", "id", "titulo" FROM "formularios";
DROP TABLE "formularios";
ALTER TABLE "new_formularios" RENAME TO "formularios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
