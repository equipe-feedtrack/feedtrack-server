interface IPergunta {
    id: string;
    texto: string;
    tipo: string;
    opcoes?: string[] | undefined;
    formularioId: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    dataExclusao?: Date | null;
  }

  type CriarPerguntaProps = Omit<IPergunta, 'id'> & Omit<IPergunta, 'formularioId'> & { opcoes?: string[] } & {id?: string;};

 type RecuperarPerguntaProps = Omit<IPergunta, 'opcoes'>  & { opcoes?: string[] } & {id: string;};

  export {
    IPergunta,
    CriarPerguntaProps,
    RecuperarPerguntaProps
  }