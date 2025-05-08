
interface IPergunta {
    id: number;
    texto: string;
    tipo: string;
    opcoes?: string[];
    ordem: number;
  }

  type CriarPerguntaProps =  Omit<IPergunta, 'id'>[];

  export {IPergunta, CriarPerguntaProps}