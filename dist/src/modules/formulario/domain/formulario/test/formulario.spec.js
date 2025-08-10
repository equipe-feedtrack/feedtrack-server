"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const pergunta_entity_1 = require("../../pergunta/pergunta.entity");
const formulario_entity_1 = require("../formulario.entity");
const formulario_exception_1 = require("../formulario.exception");
(0, vitest_1.describe)("Entidade Formulario", () => {
    let perguntaNota;
    let perguntaTexto;
    let perguntaMultiplaEscolha;
    (0, vitest_1.beforeEach)(() => {
        perguntaNota = pergunta_entity_1.Pergunta.criar({
            texto: "Qual a sua nota?",
            tipo: "nota",
            opcoes: ["1", "2", "3", "4", "5"]
        });
        perguntaTexto = pergunta_entity_1.Pergunta.criar({
            texto: "Descreva sua experiência.",
            tipo: "texto"
        });
        perguntaMultiplaEscolha = pergunta_entity_1.Pergunta.criar({
            texto: "Qual seu canal favorito?",
            tipo: "multipla_escolha",
            opcoes: ["Instagram", "WhatsApp", "Email"]
        });
    });
    (0, vitest_1.it)("deve criar um formulário com sucesso", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Avaliação",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        });
        (0, vitest_1.expect)(formulario.id).toBeDefined();
        (0, vitest_1.expect)(formulario.titulo).toBe("Formulário de Avaliação");
        (0, vitest_1.expect)(formulario.descricao).toBe("Queremos saber sua opinião!");
        (0, vitest_1.expect)(formulario.perguntas.length).toBe(0);
        (0, vitest_1.expect)(formulario.ativo).toBe(true);
        (0, vitest_1.expect)(formulario.dataCriacao).toBeInstanceOf(Date);
    });
    (0, vitest_1.it)("deve lançar erro ao criar formulário com título vazio", () => {
        (0, vitest_1.expect)(() => formulario_entity_1.Formulario.criar({
            titulo: " ",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        })).toThrowError(formulario_exception_1.FormularioTituloVazioException);
    });
    (0, vitest_1.it)("deve recuperar um formulário com perguntas existentes", () => {
        const formularioRecuperado = formulario_entity_1.Formulario.recuperar({
            id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
            titulo: "Formulário Recuperado",
            descricao: "Descrição do formulário",
            perguntas: [perguntaNota],
            ativo: true,
            dataCriacao: new Date("2024-01-01"),
            dataAtualizacao: new Date("2024-01-02"),
            dataExclusao: null
        });
        (0, vitest_1.expect)(formularioRecuperado.id).toBe("89eebea5-2314-47bf-8510-e1ddf69503a9");
        (0, vitest_1.expect)(formularioRecuperado.perguntas.length).toBe(1);
        (0, vitest_1.expect)(formularioRecuperado.ativo).toBe(true);
    });
    (0, vitest_1.it)("deve adicionar uma pergunta ao formulário", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Adição",
            descricao: "Queremos saber sua opinião!",
            perguntas: []
        });
        formulario.adicionarPergunta(perguntaNota);
        (0, vitest_1.expect)(formulario.perguntas.length).toBe(1);
        (0, vitest_1.expect)(formulario.perguntas[0].texto).toBe("Qual a sua nota?");
    });
    (0, vitest_1.it)("deve remover uma pergunta do formulário", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário com remoção",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        });
        formulario.adicionarPergunta(perguntaNota);
        formulario.removerPergunta(perguntaNota.id);
        (0, vitest_1.expect)(formulario.perguntas.length).toBe(0);
    });
    (0, vitest_1.it)("deve atualizar o título do formulário", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Atualização",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        });
        formulario.atualizarTitulo("Novo Título");
        (0, vitest_1.expect)(formulario.titulo).toBe("Novo Título");
    });
    (0, vitest_1.it)("deve lançar erro ao atualizar o título com string vazia", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Avaliação",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        });
        (0, vitest_1.expect)(() => formulario.atualizarTitulo("")).toThrowError(formulario_exception_1.FormularioTituloVazioException);
    });
    (0, vitest_1.it)("deve atualizar a descrição do formulário", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Avaliação",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        });
        formulario.atualizarDescricao("Nova descrição");
        (0, vitest_1.expect)(formulario.descricao).toBe("Nova descrição");
    });
    (0, vitest_1.it)("deve ativar e desativar o formulário", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Feedback",
            descricao: "Queremos saber sua opinião!",
            perguntas: [],
        });
        formulario.desativar();
        (0, vitest_1.expect)(formulario.ativo).toBe(false);
        formulario.ativar();
        (0, vitest_1.expect)(formulario.ativo).toBe(true);
    });
    (0, vitest_1.it)("deve criar um formulário com perguntas de tipos diferentes", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Formulário de Feedback",
            descricao: "Ajude-nos a melhorar.",
            perguntas: [perguntaNota, perguntaTexto, perguntaMultiplaEscolha],
        });
        (0, vitest_1.expect)(formulario).toBeInstanceOf(formulario_entity_1.Formulario);
        (0, vitest_1.expect)(formulario.titulo).toBe("Formulário de Feedback");
        (0, vitest_1.expect)(formulario.perguntas.length).toBe(3);
    });
    (0, vitest_1.it)("deve criar um formulário com apenas uma pergunta do tipo texto", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Comentário Geral",
            descricao: "Deixe seu comentário.",
            perguntas: [perguntaTexto],
        });
        (0, vitest_1.expect)(formulario.perguntas.length).toBe(1);
        (0, vitest_1.expect)(formulario.perguntas[0].tipo).toBe("texto");
    });
    (0, vitest_1.it)("deve criar um formulário com perguntas do tipo multipla_escolha", () => {
        const p1 = pergunta_entity_1.Pergunta.criar({
            texto: "Escolha sua cor preferida.",
            tipo: "multipla_escolha",
            opcoes: ["Azul", "Vermelho", "Verde"]
        });
        const p2 = pergunta_entity_1.Pergunta.criar({
            texto: "Escolha seu animal favorito.",
            tipo: "multipla_escolha",
            opcoes: ["Cachorro", "Gato", "Pássaro"]
        });
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Preferências Pessoais",
            descricao: "Queremos saber mais sobre você.",
            perguntas: [p1, p2],
        });
        (0, vitest_1.expect)(formulario.perguntas.length).toBe(2);
        formulario.perguntas.forEach(p => {
            (0, vitest_1.expect)(p.tipo).toBe("multipla_escolha");
        });
    });
    (0, vitest_1.it)("deve criar um formulário com data de criação e atualização válidas", () => {
        const now = new Date();
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Avaliação",
            descricao: "Nos avalie.",
            perguntas: [perguntaNota],
        });
        (0, vitest_1.expect)(formulario.dataCriacao.getTime()).toBeLessThanOrEqual(Date.now());
        (0, vitest_1.expect)(formulario.dataAtualizacao.getTime()).toBeLessThanOrEqual(Date.now());
        (0, vitest_1.expect)(formulario.dataCriacao).toBeInstanceOf(Date);
        (0, vitest_1.expect)(formulario.dataAtualizacao).toBeInstanceOf(Date);
    });
    (0, vitest_1.it)("deve criar um formulário inativo se explicitado", () => {
        const formulario = formulario_entity_1.Formulario.criar({
            titulo: "Inativo",
            descricao: "Formulário não disponível.",
            perguntas: [],
            ativo: false
        });
        (0, vitest_1.expect)(formulario.ativo).toBe(false);
    });
});
//# sourceMappingURL=formulario.spec.js.map