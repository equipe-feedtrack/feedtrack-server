/*
  Warnings:

  - You are about to drop the column `cliente_id` on the `envios_formulario` table. All the data in the column will be lost.
  - You are about to drop the column `formulario_id` on the `envios_formulario` table. All the data in the column will be lost.
  - You are about to drop the column `produto_id` on the `envios_formulario` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `envios_formulario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."envios_formulario" DROP CONSTRAINT "envios_formulario_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."envios_formulario" DROP CONSTRAINT "envios_formulario_formulario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."envios_formulario" DROP CONSTRAINT "envios_formulario_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."envios_formulario" DROP CONSTRAINT "envios_formulario_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedbacks" DROP CONSTRAINT "feedbacks_envio_id_fkey";

-- AlterTable
ALTER TABLE "public"."envios_formulario" DROP COLUMN "cliente_id",
DROP COLUMN "formulario_id",
DROP COLUMN "produto_id",
DROP COLUMN "usuario_id",
ADD COLUMN     "venda_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "public"."vendas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
