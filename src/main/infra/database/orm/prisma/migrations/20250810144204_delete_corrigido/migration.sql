/*
  Warnings:

  - You are about to drop the column `resposta` on the `feedbacks` table. All the data in the column will be lost.
  - The primary key for the `perguntas_on_formularios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `respostas` to the `feedbacks` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `perguntas_on_formularios` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
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
    "formulario_id" TEXT,
    CONSTRAINT "campanhas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campanhas" ("ativo", "canal_envio", "data_atualizacao", "data_criacao", "data_exclusao", "data_fim", "data_inicio", "descricao", "formulario_id", "id", "segmento_alvo", "template_mensagem", "tipo_campanha", "titulo") SELECT "ativo", "canal_envio", "data_atualizacao", "data_criacao", "data_exclusao", "data_fim", "data_inicio", "descricao", "formulario_id", "id", "segmento_alvo", "template_mensagem", "tipo_campanha", "titulo" FROM "campanhas";
DROP TABLE "campanhas";
ALTER TABLE "new_campanhas" RENAME TO "campanhas";
CREATE TABLE "new_clientes_on_produtos" (
    "cliente_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,

    PRIMARY KEY ("cliente_id", "produto_id"),
    CONSTRAINT "clientes_on_produtos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "clientes_on_produtos_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_clientes_on_produtos" ("cliente_id", "produto_id") SELECT "cliente_id", "produto_id" FROM "clientes_on_produtos";
DROP TABLE "clientes_on_produtos";
ALTER TABLE "new_clientes_on_produtos" RENAME TO "clientes_on_produtos";
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
    CONSTRAINT "envios_formulario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_envios_formulario" ("campanha_id", "cliente_id", "data_criacao", "data_envio", "formulario_id", "id", "status", "tentativas_envio", "ultima_mensagem_erro", "usuario_id") SELECT "campanha_id", "cliente_id", "data_criacao", "data_envio", "formulario_id", "id", "status", "tentativas_envio", "ultima_mensagem_erro", "usuario_id" FROM "envios_formulario";
DROP TABLE "envios_formulario";
ALTER TABLE "new_envios_formulario" RENAME TO "envios_formulario";
CREATE TABLE "new_feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "respostas" JSONB NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_exclusao" DATETIME,
    "formulario_id" TEXT,
    "envio_id" TEXT,
    CONSTRAINT "feedbacks_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "envios_formulario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feedbacks" ("data_criacao", "data_exclusao", "envio_id", "formulario_id", "id") SELECT "data_criacao", "data_exclusao", "envio_id", "formulario_id", "id" FROM "feedbacks";
DROP TABLE "feedbacks";
ALTER TABLE "new_feedbacks" RENAME TO "feedbacks";
CREATE UNIQUE INDEX "feedbacks_envio_id_key" ON "feedbacks"("envio_id");
CREATE TABLE "new_perguntas_on_formularios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pergunta_id" TEXT NOT NULL,
    "formulario_id" TEXT NOT NULL,
    "ordem_na_lista" INTEGER NOT NULL,
    CONSTRAINT "perguntas_on_formularios_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "perguntas_on_formularios_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_perguntas_on_formularios" ("formulario_id", "ordem_na_lista", "pergunta_id") SELECT "formulario_id", "ordem_na_lista", "pergunta_id" FROM "perguntas_on_formularios";
DROP TABLE "perguntas_on_formularios";
ALTER TABLE "new_perguntas_on_formularios" RENAME TO "perguntas_on_formularios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
