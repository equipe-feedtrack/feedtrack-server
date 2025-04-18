/*
  Warnings:

  - You are about to alter the column `nome` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(55)`.
  - You are about to alter the column `telefone` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "clientes" ALTER COLUMN "nome" SET DATA TYPE VARCHAR(55),
ALTER COLUMN "telefone" SET DATA TYPE VARCHAR(11);
