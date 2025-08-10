/*
  Warnings:

  - You are about to alter the column `resposta` on the `feedbacks` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resposta" JSONB NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_exclusao" DATETIME,
    "formulario_id" TEXT NOT NULL,
    "envio_id" TEXT NOT NULL,
    CONSTRAINT "feedbacks_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "envios_formulario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_feedbacks" ("data_criacao", "data_exclusao", "envio_id", "formulario_id", "id", "resposta") SELECT "data_criacao", "data_exclusao", "envio_id", "formulario_id", "id", "resposta" FROM "feedbacks";
DROP TABLE "feedbacks";
ALTER TABLE "new_feedbacks" RENAME TO "feedbacks";
CREATE UNIQUE INDEX "feedbacks_envio_id_key" ON "feedbacks"("envio_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
