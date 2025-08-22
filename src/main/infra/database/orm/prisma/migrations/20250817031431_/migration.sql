/*
  Warnings:

  - Added the required column `venda_id` to the `feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."feedbacks" ADD COLUMN     "venda_id" TEXT NOT NULL;
