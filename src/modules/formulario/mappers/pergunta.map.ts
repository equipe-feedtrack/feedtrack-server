import { Pergunta } from "../domain/pergunta/pergunta.entity";
import { IPergunta, RecuperarPerguntaProps } from "../domain/pergunta/pergunta.types";

class PerguntaMap {

    public static toDTO(pergunta: Pergunta): IPergunta {
        return {
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: pergunta.opcoes,
        }
    }

    public static toDomain(pergunta: RecuperarPerguntaProps): Pergunta {
        return Pergunta.recuperar(pergunta);
    }

}

export { PerguntaMap };
