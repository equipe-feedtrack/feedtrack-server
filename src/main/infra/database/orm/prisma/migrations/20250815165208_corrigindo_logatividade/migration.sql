-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "logs_atividade_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "logs_atividade_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_logs_atividade" ("acao", "data_ocorrencia", "detalhes", "empresaId", "entidade_alvo_id", "entidade_alvo_tipo", "id", "nome_usuario", "tipo_usuario", "usuario_id") SELECT "acao", "data_ocorrencia", "detalhes", "empresaId", "entidade_alvo_id", "entidade_alvo_tipo", "id", "nome_usuario", "tipo_usuario", "usuario_id" FROM "logs_atividade";
DROP TABLE "logs_atividade";
ALTER TABLE "new_logs_atividade" RENAME TO "logs_atividade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
