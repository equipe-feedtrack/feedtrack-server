/*
  Warnings:

  - You are about to drop the column `email` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `nome_usuario` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pessoaId` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha_hash` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "pessoas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "data_nascimento" DATETIME,
    "cpf" TEXT,
    "cnpj" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome_usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "pessoaId" TEXT NOT NULL,
    CONSTRAINT "usuarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_usuarios" ("data_atualizacao", "data_criacao", "data_exclusao", "id", "status", "tipo") SELECT "data_atualizacao", "data_criacao", "data_exclusao", "id", "status", "tipo" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_nome_usuario_key" ON "usuarios"("nome_usuario");
CREATE UNIQUE INDEX "usuarios_pessoaId_key" ON "usuarios"("pessoaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_email_key" ON "pessoas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_telefone_key" ON "pessoas"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_cpf_key" ON "pessoas"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_cnpj_key" ON "pessoas"("cnpj");
