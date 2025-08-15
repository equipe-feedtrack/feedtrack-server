/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `funcionarios` table. All the data in the column will be lost.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `usuarios` table. All the data in the column will be lost.
  - The required column `usuarioId` was added to the `usuarios` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_envios_formulario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "tentativas_envio" INTEGER NOT NULL DEFAULT 0,
    "ultima_mensagem_erro" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_envio" DATETIME,
    "formulario_id" TEXT,
    "cliente_id" TEXT,
    "campanha_id" TEXT,
    "usuario_id" TEXT,
    CONSTRAINT "envios_formulario_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanhas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("usuarioId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_envios_formulario" ("campanha_id", "cliente_id", "data_criacao", "data_envio", "formulario_id", "id", "status", "tentativas_envio", "ultima_mensagem_erro", "usuario_id") SELECT "campanha_id", "cliente_id", "data_criacao", "data_envio", "formulario_id", "id", "status", "tentativas_envio", "ultima_mensagem_erro", "usuario_id" FROM "envios_formulario";
DROP TABLE "envios_formulario";
ALTER TABLE "new_envios_formulario" RENAME TO "envios_formulario";
CREATE TABLE "new_funcionarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cargo" TEXT NOT NULL,
    "data_admissao" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);
INSERT INTO "new_funcionarios" ("cargo", "data_admissao", "data_atualizacao", "data_criacao", "data_exclusao", "id", "status") SELECT "cargo", "data_admissao", "data_atualizacao", "data_criacao", "data_exclusao", "id", "status" FROM "funcionarios";
DROP TABLE "funcionarios";
ALTER TABLE "new_funcionarios" RENAME TO "funcionarios";
CREATE TABLE "new_logs_atividade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "acao" TEXT NOT NULL,
    "detalhes" TEXT,
    "data_ocorrencia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_usuario" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "entidade_alvo_id" TEXT,
    "entidade_alvo_tipo" TEXT,
    CONSTRAINT "logs_atividade_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_logs_atividade" ("acao", "data_ocorrencia", "detalhes", "entidade_alvo_id", "entidade_alvo_tipo", "id", "nome_usuario", "tipo_usuario", "usuario_id") SELECT "acao", "data_ocorrencia", "detalhes", "entidade_alvo_id", "entidade_alvo_tipo", "id", "nome_usuario", "tipo_usuario", "usuario_id" FROM "logs_atividade";
DROP TABLE "logs_atividade";
ALTER TABLE "new_logs_atividade" RENAME TO "logs_atividade";
CREATE TABLE "new_usuarios" (
    "usuarioId" TEXT NOT NULL PRIMARY KEY,
    "nome_usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);
INSERT INTO "new_usuarios" ("data_atualizacao", "data_criacao", "data_exclusao", "nome_usuario", "senha_hash", "status", "tipo") SELECT "data_atualizacao", "data_criacao", "data_exclusao", "nome_usuario", "senha_hash", "status", "tipo" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_nome_usuario_key" ON "usuarios"("nome_usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
