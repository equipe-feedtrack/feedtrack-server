/*
  Warnings:

  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `empresaId` to the `envios_formulario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `logs_atividade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `perguntas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Feedback_envio_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Feedback";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "respostas" JSONB NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_exclusao" DATETIME,
    "cliente_nome" TEXT,
    "produto_nome" TEXT,
    "funcionario_nome" TEXT,
    "empresaId" TEXT NOT NULL,
    "formulario_id" TEXT,
    "envio_id" TEXT,
    CONSTRAINT "feedbacks_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "envios_formulario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "usuario_id" TEXT NOT NULL,
    "produto_id" TEXT,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "envios_formulario_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanhas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_envios_formulario" ("campanha_id", "cliente_id", "data_criacao", "data_envio", "formulario_id", "id", "produto_id", "status", "tentativas_envio", "ultima_mensagem_erro", "usuario_id") SELECT "campanha_id", "cliente_id", "data_criacao", "data_envio", "formulario_id", "id", "produto_id", "status", "tentativas_envio", "ultima_mensagem_erro", "usuario_id" FROM "envios_formulario";
DROP TABLE "envios_formulario";
ALTER TABLE "new_envios_formulario" RENAME TO "envios_formulario";
CREATE TABLE "new_formularios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    CONSTRAINT "formularios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_formularios" ("ativo", "data_atualizacao", "data_criacao", "data_exclusao", "descricao", "empresa_id", "id", "titulo") SELECT "ativo", "data_atualizacao", "data_criacao", "data_exclusao", "descricao", "empresa_id", "id", "titulo" FROM "formularios";
DROP TABLE "formularios";
ALTER TABLE "new_formularios" RENAME TO "formularios";
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
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "logs_atividade_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "logs_atividade_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_logs_atividade" ("acao", "data_ocorrencia", "detalhes", "entidade_alvo_id", "entidade_alvo_tipo", "id", "nome_usuario", "tipo_usuario", "usuario_id") SELECT "acao", "data_ocorrencia", "detalhes", "entidade_alvo_id", "entidade_alvo_tipo", "id", "nome_usuario", "tipo_usuario", "usuario_id" FROM "logs_atividade";
DROP TABLE "logs_atividade";
ALTER TABLE "new_logs_atividade" RENAME TO "logs_atividade";
CREATE TABLE "new_perguntas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "opcoes" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "empresaId" TEXT NOT NULL,
    CONSTRAINT "perguntas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_perguntas" ("ativo", "data_atualizacao", "data_criacao", "data_exclusao", "id", "opcoes", "texto", "tipo") SELECT "ativo", "data_atualizacao", "data_criacao", "data_exclusao", "id", "opcoes", "texto", "tipo" FROM "perguntas";
DROP TABLE "perguntas";
ALTER TABLE "new_perguntas" RENAME TO "perguntas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_envio_id_key" ON "feedbacks"("envio_id");
