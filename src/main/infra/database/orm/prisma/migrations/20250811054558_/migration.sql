/*
  Warnings:

  - You are about to drop the `pessoas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `pessoaId` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `pessoaId` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "pessoas_cnpj_key";

-- DropIndex
DROP INDEX "pessoas_cpf_key";

-- DropIndex
DROP INDEX "pessoas_telefone_key";

-- DropIndex
DROP INDEX "pessoas_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pessoas";
PRAGMA foreign_keys=on;

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
    "data_exclusao" DATETIME
);
INSERT INTO "new_clientes" ("cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome", "status", "telefone", "vendedor_responsavel") SELECT "cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome", "status", "telefone", "vendedor_responsavel" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome_usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);
INSERT INTO "new_usuarios" ("data_atualizacao", "data_criacao", "data_exclusao", "id", "nome_usuario", "senha_hash", "status", "tipo") SELECT "data_atualizacao", "data_criacao", "data_exclusao", "id", "nome_usuario", "senha_hash", "status", "tipo" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_nome_usuario_key" ON "usuarios"("nome_usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
