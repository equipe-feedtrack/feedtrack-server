/*
  Warnings:

  - You are about to drop the column `token_recuperacao` on the `usuarios` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome_usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "email" TEXT,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "nome_empresa" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);
INSERT INTO "new_usuarios" ("data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome_empresa", "nome_usuario", "senha_hash", "status", "tipo") SELECT "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome_empresa", "nome_usuario", "senha_hash", "status", "tipo" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_nome_usuario_key" ON "usuarios"("nome_usuario");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
