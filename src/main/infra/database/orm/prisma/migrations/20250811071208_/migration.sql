/*
  Warnings:

  - You are about to drop the column `dataAdmissao` on the `funcionarios` table. All the data in the column will be lost.
  - Added the required column `data_admissao` to the `funcionarios` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_funcionarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cargo" TEXT NOT NULL,
    "data_admissao" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "usuario_id" TEXT NOT NULL,
    CONSTRAINT "funcionarios_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_funcionarios" ("cargo", "data_atualizacao", "data_criacao", "data_exclusao", "id", "status", "usuario_id") SELECT "cargo", "data_atualizacao", "data_criacao", "data_exclusao", "id", "status", "usuario_id" FROM "funcionarios";
DROP TABLE "funcionarios";
ALTER TABLE "new_funcionarios" RENAME TO "funcionarios";
CREATE UNIQUE INDEX "funcionarios_usuario_id_key" ON "funcionarios"("usuario_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
