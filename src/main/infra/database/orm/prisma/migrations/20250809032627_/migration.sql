-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campanhas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo_campanha" TEXT NOT NULL,
    "segmento_alvo" TEXT NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    "canal_envio" TEXT NOT NULL DEFAULT 'EMAIL',
    "template_mensagem" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "formulario_id" TEXT NOT NULL,
    CONSTRAINT "campanhas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_campanhas" ("ativo", "data_atualizacao", "data_criacao", "data_exclusao", "data_fim", "data_inicio", "descricao", "formulario_id", "id", "segmento_alvo", "template_mensagem", "tipo_campanha", "titulo") SELECT "ativo", "data_atualizacao", "data_criacao", "data_exclusao", "data_fim", "data_inicio", "descricao", "formulario_id", "id", "segmento_alvo", "template_mensagem", "tipo_campanha", "titulo" FROM "campanhas";
DROP TABLE "campanhas";
ALTER TABLE "new_campanhas" RENAME TO "campanhas";
CREATE TABLE "new_perguntas_on_formularios" (
    "pergunta_id" TEXT NOT NULL,
    "formulario_id" TEXT NOT NULL,
    "ordem_na_lista" INTEGER NOT NULL,

    PRIMARY KEY ("pergunta_id", "formulario_id"),
    CONSTRAINT "perguntas_on_formularios_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "perguntas_on_formularios_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_perguntas_on_formularios" ("formulario_id", "ordem_na_lista", "pergunta_id") SELECT "formulario_id", "ordem_na_lista", "pergunta_id" FROM "perguntas_on_formularios";
DROP TABLE "perguntas_on_formularios";
ALTER TABLE "new_perguntas_on_formularios" RENAME TO "perguntas_on_formularios";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
