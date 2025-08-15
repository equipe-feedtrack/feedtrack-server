-- CreateEnum
CREATE TYPE "public"."StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."StatusFormulario" AS ENUM ('PENDENTE', 'ENVIADO', 'FALHA');

-- CreateEnum
CREATE TYPE "public"."TipoCampanha" AS ENUM ('POS_COMPRA', 'AUTOMATICO', 'PROMOCIONAL', 'SATISFACAO');

-- CreateEnum
CREATE TYPE "public"."SegmentoAlvo" AS ENUM ('TODOS_CLIENTES', 'CLIENTES_REGULARES', 'NOVOS_CLIENTES', 'CLIENTES_PREMIUM');

-- CreateEnum
CREATE TYPE "public"."TipoAcao" AS ENUM ('CRIAR_USUARIO', 'ATUALIZAR_USUARIO', 'CRIAR_CLIENTE', 'ATUALIZAR_CLIENTE', 'DESATIVAR_CAMPANHA', 'INICIAR_ENVIO_CAMPANHA');

-- CreateEnum
CREATE TYPE "public"."EntidadeAlvoTipo" AS ENUM ('USUARIO', 'CLIENTE', 'CAMPANHA', 'FORMULARIO', 'PRODUTO', 'ENVIO_FORMULARIO');

-- CreateEnum
CREATE TYPE "public"."CanalEnvio" AS ENUM ('EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "public"."Plano" AS ENUM ('FREE', 'BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "public"."StatusEmpresa" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "public"."empresas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "plano" "public"."Plano" NOT NULL DEFAULT 'FREE',
    "status" "public"."StatusEmpresa" NOT NULL DEFAULT 'ATIVO',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" TEXT NOT NULL,
    "nome_usuario" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "email" TEXT,
    "tipo" "public"."TipoUsuario" NOT NULL,
    "status" "public"."StatusUsuario" NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."funcionarios" (
    "id" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "data_admissao" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs_atividade" (
    "id" TEXT NOT NULL,
    "acao" "public"."TipoAcao" NOT NULL,
    "detalhes" TEXT,
    "data_ocorrencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_usuario" TEXT NOT NULL,
    "tipo_usuario" "public"."TipoUsuario" NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "entidade_alvo_id" TEXT,
    "entidade_alvo_tipo" "public"."EntidadeAlvoTipo",
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "logs_atividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "cidade" TEXT,
    "status" "public"."StatusUsuario" NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendas" (
    "id" TEXT NOT NULL,
    "data_venda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."perguntas" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "opcoes" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."formularios" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),

    CONSTRAINT "formularios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."perguntas_on_formularios" (
    "id" TEXT NOT NULL,
    "pergunta_id" TEXT NOT NULL,
    "formulario_id" TEXT NOT NULL,
    "ordem_na_lista" INTEGER NOT NULL,

    CONSTRAINT "perguntas_on_formularios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."campanhas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo_campanha" "public"."TipoCampanha" NOT NULL,
    "segmento_alvo" "public"."SegmentoAlvo" NOT NULL,
    "canal_envio" "public"."CanalEnvio" NOT NULL DEFAULT 'EMAIL',
    "data_fim" TIMESTAMP(3),
    "template_mensagem" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "data_exclusao" TIMESTAMP(3),
    "empresaId" TEXT NOT NULL,
    "formulario_id" TEXT,

    CONSTRAINT "campanhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."envios_formulario" (
    "id" TEXT NOT NULL,
    "status" "public"."StatusFormulario" NOT NULL DEFAULT 'PENDENTE',
    "tentativas_envio" INTEGER NOT NULL DEFAULT 0,
    "ultima_mensagem_erro" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_envio" TIMESTAMP(3),
    "formulario_id" TEXT,
    "cliente_id" TEXT,
    "campanha_id" TEXT,
    "usuario_id" TEXT NOT NULL,
    "produto_id" TEXT,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "envios_formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedbacks" (
    "id" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_exclusao" TIMESTAMP(3),
    "cliente_nome" TEXT,
    "produto_nome" TEXT,
    "funcionario_nome" TEXT,
    "empresaId" TEXT NOT NULL,
    "formulario_id" TEXT,
    "envio_id" TEXT,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nome_key" ON "public"."empresas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "public"."empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_email_key" ON "public"."empresas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nome_usuario_key" ON "public"."usuarios"("nome_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_usuario_id_key" ON "public"."funcionarios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_envio_id_key" ON "public"."feedbacks"("envio_id");

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."funcionarios" ADD CONSTRAINT "funcionarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."funcionarios" ADD CONSTRAINT "funcionarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_atividade" ADD CONSTRAINT "logs_atividade_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."logs_atividade" ADD CONSTRAINT "logs_atividade_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendas" ADD CONSTRAINT "vendas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."perguntas" ADD CONSTRAINT "perguntas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."formularios" ADD CONSTRAINT "formularios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."perguntas_on_formularios" ADD CONSTRAINT "perguntas_on_formularios_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "public"."perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."perguntas_on_formularios" ADD CONSTRAINT "perguntas_on_formularios_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "public"."formularios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."campanhas" ADD CONSTRAINT "campanhas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."campanhas" ADD CONSTRAINT "campanhas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "public"."formularios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "public"."formularios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "public"."campanhas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."envios_formulario" ADD CONSTRAINT "envios_formulario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "public"."formularios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedbacks" ADD CONSTRAINT "feedbacks_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "public"."envios_formulario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
