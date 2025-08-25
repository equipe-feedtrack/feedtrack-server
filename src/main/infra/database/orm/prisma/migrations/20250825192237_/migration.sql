-- DropForeignKey
ALTER TABLE "public"."vendas" DROP CONSTRAINT "vendas_clienteId_fkey";

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
