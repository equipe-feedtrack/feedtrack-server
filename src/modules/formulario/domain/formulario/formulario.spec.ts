import { Cliente } from "@modules/gestao_clientes/domain/cliente/cliente.entity";
import { beforeEach, describe, expect, it } from "vitest";
import { Pergunta } from "../pergunta/pergunta.entity";
import { Formulario } from "./formulario.entity";
import { FormularioTituloVazioException } from "./formulario.exception";

describe("Entidade Formulario", () => {
  let perguntaNota: Pergunta;
  let perguntaTexto: Pergunta;
  let perguntaMultiplaEscolha: Pergunta;
  let cliente: Cliente;
  // let funcionario: Funcionario;

  beforeEach(() => {
     cliente =  Cliente.criarCliente({ 
      nome: "João da Silva",
      telefone: "+55 11 91234-5678",
      email: "joao.silva@email.com",
      cidade: "Aracaju",
      vendedorResponsavel: "Yago",
      produtos: [{nome: "Tênis de corrida", descricao: "Tênis profissional para quem já tem experiência", valor: 320}]
    });
    // funcionario = new Funcionario("func-1", "Maria Souza");
    perguntaNota = Pergunta.criar({
      texto: "Qual a sua nota?",
      tipo: "nota",
      ordensUsadas: [],
      opcoes: ["1", "2", "3", "4", "5"]
    });

    perguntaTexto = Pergunta.criar({
      texto: "Descreva sua experiência.",
      tipo: "texto",
      ordensUsadas: []
    });

    perguntaMultiplaEscolha = Pergunta.criar({
      texto: "Qual seu canal favorito?",
      tipo: "multipla_escolha",
      ordensUsadas: [],
      opcoes: ["Instagram", "WhatsApp", "Email"]
    });
  });

  it("deve criar um formulário com sucesso", () => {
    const formulario = Formulario.criar({
  titulo: "Formulário de Avaliação",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
});

    expect(formulario.id).toBeDefined();
    expect(formulario.titulo).toBe("Formulário de Avaliação");
    expect(formulario.descricao).toBe("Queremos saber sua opinião!");
    expect(formulario.perguntas.length).toBe(0);
    expect(formulario.ativo).toBe(true);
    expect(formulario.dataCriacao).toBeInstanceOf(Date);
  });

  it("deve lançar erro ao criar formulário com título vazio", () => {
    expect(() => Formulario.criar({
  titulo: " ",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
})).toThrowError(FormularioTituloVazioException);
  });

  it("deve recuperar um formulário com perguntas existentes", () => {
    const formularioRecuperado = Formulario.recuperar({
      id: "89eebea5-2314-47bf-8510-e1ddf69503a9",
      titulo: "Formulário Recuperado",
      descricao: "Descrição do formulário",
      perguntas: [perguntaNota],
      cliente: cliente,
      ativo: true,
      dataCriacao: new Date("2024-01-01"),
      dataAtualizacao: new Date("2024-01-02"),
    });

    expect(formularioRecuperado.id).toBe("89eebea5-2314-47bf-8510-e1ddf69503a9");
    expect(formularioRecuperado.perguntas.length).toBe(1);
    expect(formularioRecuperado.ativo).toBe(true);
  });

  it("deve adicionar uma pergunta ao formulário", () => {
    const formulario = Formulario.criar({
  titulo: "Formulário de Adição",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
});

    formulario.adicionarPergunta(perguntaNota);

    expect(formulario.perguntas.length).toBe(1);
    expect(formulario.perguntas[0].texto).toBe("Qual a sua nota?");
  });

  it("deve remover uma pergunta do formulário", () => {
    const formulario = Formulario.criar({
  titulo: "Formulário com remoção",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
});
    formulario.adicionarPergunta(perguntaNota);

    formulario.removerPergunta(perguntaNota.id);

    expect(formulario.perguntas.length).toBe(0);
  });

  it("deve atualizar o título do formulário", () => {
    const formulario = Formulario.criar({
    titulo: "Formulário de Atualização",
    descricao: "Queremos saber sua opinião!",
    perguntas: [],
    cliente: cliente
});

    formulario.atualizarTitulo("Novo Título");

    expect(formulario.titulo).toBe("Novo Título");
  });

  it("deve lançar erro ao atualizar o título com string vazia", () => {
    const formulario = Formulario.criar({
  titulo: "Formulário de Avaliação",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
});

    expect(() => formulario.atualizarTitulo("")).toThrowError(FormularioTituloVazioException);
  });

  it("deve atualizar a descrição do formulário", () => {
    const formulario = Formulario.criar({
  titulo: "Formulário de Avaliação",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
});

    formulario.atualizarDescricao("Nova descrição");

    expect(formulario.descricao).toBe("Nova descrição");
  });

  it("deve ativar e desativar o formulário", () => {
    const formulario = Formulario.criar({
  titulo: "Formulário de Feedback",
  descricao: "Queremos saber sua opinião!",
  perguntas: [],
  cliente: cliente
});

    formulario.desativar();
    expect(formulario.ativo).toBe(false);

    formulario.ativar();
    expect(formulario.ativo).toBe(true);
  });
  it("deve criar um formulário com perguntas de tipos diferentes", () => {
    const formulario = Formulario.criar({
      titulo: "Formulário de Feedback",
      descricao: "Ajude-nos a melhorar.",
      perguntas: [perguntaNota, perguntaTexto, perguntaMultiplaEscolha],
      cliente: cliente
    });

    expect(formulario).toBeInstanceOf(Formulario);
    expect(formulario.titulo).toBe("Formulário de Feedback");
    expect(formulario.perguntas.length).toBe(3);
  });

  it("deve criar um formulário com apenas uma pergunta do tipo texto", () => {
    const formulario = Formulario.criar({
      titulo: "Comentário Geral",
      descricao: "Deixe seu comentário.",
      perguntas: [perguntaTexto],
      cliente: cliente
    });

    expect(formulario.perguntas.length).toBe(1);
    expect(formulario.perguntas[0].tipo).toBe("texto");
  });

  it("deve criar um formulário com perguntas do tipo multipla_escolha", () => {
    const p1 = Pergunta.criar({
      texto: "Escolha sua cor preferida.",
      tipo: "multipla_escolha",
      ordensUsadas: [],
      opcoes: ["Azul", "Vermelho", "Verde"]
    });

    const p2 = Pergunta.criar({
      texto: "Escolha seu animal favorito.",
      tipo: "multipla_escolha",
      ordensUsadas: [],
      opcoes: ["Cachorro", "Gato", "Pássaro"]
    });

    const formulario = Formulario.criar({
      titulo: "Preferências Pessoais",
      descricao: "Queremos saber mais sobre você.",
      perguntas: [p1, p2],
      cliente: cliente
    });

    expect(formulario.perguntas.length).toBe(2);
    formulario.perguntas.forEach(p => {
      expect(p.tipo).toBe("multipla_escolha");
    });
  });

  it("deve criar um formulário com data de criação e atualização válidas", () => {
    const now = new Date();

    const formulario = Formulario.criar({
      titulo: "Avaliação",
      descricao: "Nos avalie.",
      perguntas: [perguntaNota],
      cliente: cliente
    });

    expect(formulario.dataCriacao.getTime()).toBeLessThanOrEqual(Date.now());
    expect(formulario.dataAtualizacao.getTime()).toBeLessThanOrEqual(Date.now());
    expect(formulario.dataCriacao).toBeInstanceOf(Date);
    expect(formulario.dataAtualizacao).toBeInstanceOf(Date);
  });

  it("deve criar um formulário inativo se explicitado", () => {
    const formulario = Formulario.criar({
      titulo: "Inativo",
      descricao: "Formulário não disponível.",
      perguntas: [],
      cliente: cliente,
      ativo: false
    });

    expect(formulario.ativo).toBe(false);
  });
});