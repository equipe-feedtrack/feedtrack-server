-- DropForeignKey
ALTER TABLE "public"."campanhas" DROP CONSTRAINT "campanhas_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."clientes" DROP CONSTRAINT "clientes_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."envios_formulario" DROP CONSTRAINT "envios_formulario_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedbacks" DROP CONSTRAINT "feedbacks_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."formularios" DROP CONSTRAINT "formularios_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."funcionarios" DROP CONSTRAINT "funcionarios_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."logs_atividade" DROP CONSTRAINT "logs_atividade_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."perguntas" DROP CONSTRAINT "perguntas_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."usuarios" DROP CONSTRAINT "usuarios_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."vendas" DROP CONSTRAINT "vendas_empresaId_fkey";

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."funcionarios" ADD CONSTRAINT "funcionarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_atividade" ADD CONSTRAINT "logs_atividade_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."perguntas" ADD CONSTRAINT "perguntas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."formularios" ADD CONSTRAINT "formularios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."campanhas" ADD CONSTRAINT "campanhas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
