interface IPergunta {
    id?: string;
    texto: string;
    tipo: string;
    opcoes?: string[];
  }

  type CriarPerguntaProps = Omit<IPergunta, 'id'> & { opcoes?: string[] } & {id?: string;};

 type RecuperarPerguntaProps = Omit<IPergunta, 'opcoes'> & { opcoes?: string[] } & {id: string;};

  export {
    IPergunta,
    CriarPerguntaProps,
    RecuperarPerguntaProps
    
  }