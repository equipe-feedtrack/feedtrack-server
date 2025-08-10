-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cargo" TEXT NOT NULL,
    "data_admissao" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "usuario_id" TEXT NOT NULL,
    CONSTRAINT "funcionarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "logs_atividade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "acao" TEXT NOT NULL,
    "detalhes" TEXT,
    "data_ocorrencia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_usuario" TEXT NOT NULL,
    "tipo_usuario" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "entidade_alvo_id" TEXT,
    "entidade_alvo_tipo" TEXT,
    CONSTRAINT "logs_atividade_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "vendedor_responsavel" TEXT NOT NULL,
    "cidade" TEXT,
    "status" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);

-- CreateTable
CREATE TABLE "clientes_on_produtos" (
    "cliente_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,

    PRIMARY KEY ("cliente_id", "produto_id"),
    CONSTRAINT "clientes_on_produtos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "clientes_on_produtos_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);

-- CreateTable
CREATE TABLE "perguntas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "opcoes" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);

-- CreateTable
CREATE TABLE "formularios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME
);

-- CreateTable
CREATE TABLE "perguntas_on_formularios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pergunta_id" TEXT NOT NULL,
    "formulario_id" TEXT NOT NULL,
    "ordem_na_lista" INTEGER NOT NULL,
    CONSTRAINT "perguntas_on_formularios_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "perguntas_on_formularios_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campanhas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo_campanha" TEXT NOT NULL,
    "segmento_alvo" TEXT NOT NULL,
    "canal_envio" TEXT NOT NULL DEFAULT 'EMAIL',
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME,
    "template_mensagem" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "data_exclusao" DATETIME,
    "formulario_id" TEXT,
    CONSTRAINT "campanhas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "envios_formulario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "tentativas_envio" INTEGER NOT NULL DEFAULT 0,
    "ultima_mensagem_erro" TEXT,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_envio" DATETIME,
    "formulario_id" TEXT,
    "cliente_id" TEXT,
    "campanha_id" TEXT,
    "usuario_id" TEXT,
    CONSTRAINT "envios_formulario_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_campanha_id_fkey" FOREIGN KEY ("campanha_id") REFERENCES "campanhas" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "envios_formulario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "respostas" JSONB NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_exclusao" DATETIME,
    "formulario_id" TEXT,
    "envio_id" TEXT,
    CONSTRAINT "feedbacks_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_envio_id_fkey" FOREIGN KEY ("envio_id") REFERENCES "envios_formulario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nome_key" ON "usuarios"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_usuario_id_key" ON "funcionarios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_envio_id_key" ON "feedbacks"("envio_id");
