-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_empresas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "plano" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);
INSERT INTO "new_empresas" ("cnpj", "data_atualizacao", "data_criacao", "data_exclusao", "id", "nome") SELECT "cnpj", "data_atualizacao", "data_criacao", "data_exclusao", "id", "nome" FROM "empresas";
DROP TABLE "empresas";
ALTER TABLE "new_empresas" RENAME TO "empresas";
CREATE UNIQUE INDEX "empresas_nome_key" ON "empresas"("nome");
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");
CREATE UNIQUE INDEX "empresas_email_key" ON "empresas"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
