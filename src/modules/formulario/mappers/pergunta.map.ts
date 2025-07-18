import { Pergunta } from "../domain/pergunta/domain/pergunta.entity";
import { IPergunta, RecuperarPerguntaProps } from "../domain/pergunta/domain/pergunta.types";

;

class PerguntaMap {
    public static toDTO(pergunta: Pergunta): IPergunta {
        return {
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: pergunta.opcoes ?? [],
        };
    }

    public static toDomain(prismaData: any): Pergunta {
        return Pergunta.recuperar({
            id: prismaData.id,
            texto: prismaData.titulo,
            tipo: prismaData.tipo_pergunta,
            opcoes: prismaData.opcoes,
            formularioId: prismaData.formulario_id,
            dataCriacao: prismaData.data_criacao,
            dataAtualizacao: prismaData.data_atualizacao,
            dataExclusao: prismaData.data_exclusao,
        });
    }
}

export { PerguntaMap };
