interface IPergunta {
    id: string;
    texto: string;
    tipo: string;
    ativo: boolean;
    opcoes?: string[] | null;
    formularioId?: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
    dataExclusao: Date | null;
  }

 type CriarPerguntaProps = Omit<IPergunta, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>;

 type RecuperarPerguntaProps = Omit<IPergunta, 'opcoes'>  & { opcoes?: string[] } & {id: string;};

  export {
    IPergunta,
    CriarPerguntaProps,
    RecuperarPerguntaProps
  }