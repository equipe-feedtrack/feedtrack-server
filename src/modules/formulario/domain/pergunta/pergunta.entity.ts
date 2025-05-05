import { IPergunta } from "./pergunta.types";

class Pergunta implements IPergunta{

private _id: number;
private _texto: string;
private _tipo: 'texto' | 'nota' | 'multipla_escolha';
private _opcoes?: string[] | undefined;
private _ordem: number;


get id(): number {
  return this._id;
}

get texto(): string {
  return this._texto;
}

private set texto(value: string) {
  if (!value) {
    throw new Error('O texto da pergunta é obrigatório.');
  }
  this._texto = value;
}

get tipo(): 'nota' | 'texto' | 'multipla_escolha' {
  return this._tipo;
}

 private set tipo(value: 'nota' | 'texto' | 'multipla_escolha') {
  if (!['nota', 'texto', 'multipla_escolha'].includes(value)) {
    throw new Error("O tipo de pergunta deve ser 'nota', 'texto' ou 'multipla_escolha'.");
  }
  this._tipo = value;
  // Limpar opções se o tipo mudar para algo que não seja múltipla escolha
  if (value !== 'multipla_escolha') {
    this._opcoes = undefined;
  }
}

public get opcoes(): string[] | undefined {
  return this._opcoes;
}

private set opcoes(value: string[] | undefined) {
  this._opcoes = value;
}


get ordem(): number {
  return this._ordem;
}

private set ordem(value: number) {
  if (value === undefined || value === null || value < 1) {
    throw new Error('A ordem da pergunta deve ser maior ou igual a 1.');
  }
  this._ordem = value;
}

constructor(data: IPergunta) {
    this._id = data.id ?? Date.now(); // Simulação de ID
    this._texto = data.texto;
    this._tipo = data.tipo;
    this._opcoes = data.opcoes;
    this._ordem = data.ordem;
    this.validar();

  }

private validar(): void {
  if (!this.texto) {
    throw new Error('O texto da pergunta é obrigatório.');
  }
  if (!['nota', 'texto', 'multipla_escolha'].includes(this.tipo)) {
    throw new Error("O tipo de pergunta deve ser 'nota', 'texto' ou 'multipla_escolha'.");
  }
  if (this.ordem < 1) {
    throw new Error('A ordem da pergunta deve ser maior ou igual a 1.');
  }
}
}

export {Pergunta}