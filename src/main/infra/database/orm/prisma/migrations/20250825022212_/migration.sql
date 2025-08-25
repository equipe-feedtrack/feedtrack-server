/*
  Warnings:

  - You are about to drop the column `produtoId` on the `vendas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."vendas" DROP CONSTRAINT "vendas_produtoId_fkey";

-- AlterTable
ALTER TABLE "public"."vendas" DROP COLUMN "produtoId";

-- CreateTable
CREATE TABLE "public"."venda_produtos" (
    "vendaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "venda_produtos_pkey" PRIMARY KEY ("vendaId","produtoId")
);

-- AddForeignKey
ALTER TABLE "public"."venda_produtos" ADD CONSTRAINT "venda_produtos_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "public"."vendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venda_produtos" ADD CONSTRAINT "venda_produtos_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
