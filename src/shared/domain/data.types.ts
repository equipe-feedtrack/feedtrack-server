interface IDatasControle {
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    dataExclusao?: Date | null;
}

export enum TipoPergunta {
  NOTA = "nota",
  TEXTO = "texto",
  MULTIPLA_ESCOLHA = "multipla_escolha"
}

type KeysDatasControle = keyof IDatasControle;

export { IDatasControle, KeysDatasControle }