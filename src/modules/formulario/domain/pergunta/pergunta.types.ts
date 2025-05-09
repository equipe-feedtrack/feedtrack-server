interface IPergunta {
    id?: string;
    texto: string;
    tipo: string;
    opcoes?: string[];
    ordem: number;
  }

  type CriarPerguntaProps =  Omit<IPergunta, 'id'>;

  type RecuperarPerguntaProps = Required<IPergunta>;

  export {
    IPergunta,
     CriarPerguntaProps,
     RecuperarPerguntaProps
    
    }