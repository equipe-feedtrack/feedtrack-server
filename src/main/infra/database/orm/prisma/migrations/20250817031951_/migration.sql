/*
  Warnings:

  - You are about to drop the column `envio_id` on the `feedbacks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."feedbacks_envio_id_key";

-- AlterTable
ALTER TABLE "public"."feedbacks" DROP COLUMN "envio_id";
