// src/modules/venda/domain/venda.exception.ts

export namespace VendaExceptions {
  export class VendaNaoEncontradaException extends Error {
    constructor(id: string) {
      super(`Venda com ID ${id} não encontrada.`);
      this.name = "VendaNaoEncontradaException";
    }
  }

  export class VendaNaoPermitidaException extends Error {
    constructor() {
      super("A venda não pertence a esta empresa.");
      this.name = "VendaNaoPermitidaException";
    }
  }
}
