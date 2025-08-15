/*
  Warnings:

  - You are about to drop the `clientes_on_produtos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `nome_empresa` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `empresaId` to the `campanhas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `funcionarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "clientes_on_produtos";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data_venda" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "vendas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vendas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vendas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campanhas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo_campanha" TEXT NOT NULL,
    "segmento_alvo" TEXT NOT NULL,
    "canal_envio" TEXT NOT NULL DEFAULT 'EMAIL',
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    "template_mensagem" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "empresaId" TEXT NOT NULL,
    "formulario_id" TEXT,
    CONSTRAINT "campanhas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "campanhas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campanhas" ("ativo", "canal_envio", "data_atualizacao", "data_criacao", "data_exclusao", "data_fim", "data_inicio", "descricao", "formulario_id", "id", "segmento_alvo", "template_mensagem", "tipo_campanha", "titulo") SELECT "ativo", "canal_envio", "data_atualizacao", "data_criacao", "data_exclusao", "data_fim", "data_inicio", "descricao", "formulario_id", "id", "segmento_alvo", "template_mensagem", "tipo_campanha", "titulo" FROM "campanhas";
DROP TABLE "campanhas";
ALTER TABLE "new_campanhas" RENAME TO "campanhas";
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
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_clientes" ("cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome", "status", "telefone", "vendedor_responsavel") SELECT "cidade", "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome", "status", "telefone", "vendedor_responsavel" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
CREATE TABLE "new_funcionarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cargo" TEXT NOT NULL,
    "data_admissao" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "usuario_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "funcionarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "funcionarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_funcionarios" ("cargo", "data_admissao", "data_atualizacao", "data_criacao", "data_exclusao", "id", "status", "usuario_id") SELECT "cargo", "data_admissao", "data_atualizacao", "data_criacao", "data_exclusao", "id", "status", "usuario_id" FROM "funcionarios";
DROP TABLE "funcionarios";
ALTER TABLE "new_funcionarios" RENAME TO "funcionarios";
CREATE UNIQUE INDEX "funcionarios_usuario_id_key" ON "funcionarios"("usuario_id");
CREATE TABLE "new_produtos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "produtos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_produtos" ("ativo", "data_atualizacao", "data_criacao", "data_exclusao", "descricao", "id", "nome", "valor") SELECT "ativo", "data_atualizacao", "data_criacao", "data_exclusao", "descricao", "id", "nome", "valor" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome_usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "email" TEXT,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_usuarios" ("data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome_usuario", "senha_hash", "status", "tipo") SELECT "data_atualizacao", "data_criacao", "data_exclusao", "email", "id", "nome_usuario", "senha_hash", "status", "tipo" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_nome_usuario_key" ON "usuarios"("nome_usuario");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nome_key" ON "empresas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");
