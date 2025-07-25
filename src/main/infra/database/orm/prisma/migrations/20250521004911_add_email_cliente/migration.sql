-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "cidade" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" DATETIME NOT NULL,
    "dataExclusao" DATETIME,
    "vendedorResponsavel" TEXT NOT NULL
);
INSERT INTO "new_clientes" ("cidade", "dataAtualizacao", "dataCriacao", "dataExclusao", "email", "id", "nome", "status", "telefone", "vendedorResponsavel") SELECT "cidade", "dataAtualizacao", "dataCriacao", "dataExclusao", "email", "id", "nome", "status", "telefone", "vendedorResponsavel" FROM "clientes";
DROP TABLE "clientes";
ALTER TABLE "new_clientes" RENAME TO "clientes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
