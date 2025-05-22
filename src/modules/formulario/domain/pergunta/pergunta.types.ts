interface IPergunta {
    id?: string;
    texto: string;
    tipo: string;
    opcoes?: string[];
    ordem: number;
  }

  type CriarPerguntaProps = Omit<IPergunta, 'id' | 'ordem'> & {
    ordensUsadas: number[];
  };

 type RecuperarPerguntaProps = Omit<IPergunta, 'opcoes'> & { opcoes?: string[] } & {id: string;};

  export {
    IPergunta,
    CriarPerguntaProps,
    RecuperarPerguntaProps
    
  }