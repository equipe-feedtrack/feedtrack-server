
interface IPergunta {
    id: number;
    texto: string;
    tipo: 'nota' | 'texto' | 'multipla_escolha';
    opcoes?: string[];
    ordem: number;
  }

  type CriarPerguntaProps =  Omit<IPergunta, 'id'>[];

  export {IPergunta, CriarPerguntaProps}