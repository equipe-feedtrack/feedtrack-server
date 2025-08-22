/*
  Warnings:

  - You are about to drop the column `segmento_alvo` on the `campanhas` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_campanha` on the `campanhas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."campanhas" DROP COLUMN "segmento_alvo",
DROP COLUMN "tipo_campanha";
