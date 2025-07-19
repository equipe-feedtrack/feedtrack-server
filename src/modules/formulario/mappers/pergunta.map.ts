import { Pergunta } from "../domain/pergunta/domain/pergunta.entity";
import { IPergunta } from "../domain/pergunta/domain/pergunta.types";

class PerguntaMap {
    public static toDTO(pergunta: Pergunta): IPergunta {
        return {
            id: pergunta.id,
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: Array.isArray(pergunta.opcoes) ? (pergunta.opcoes as string[]) : undefined,
            formularioId: pergunta.formularioId
        };
    }

    public static toDomain(prismaData: IPergunta): Pergunta {
        return Pergunta.recuperar({
            id: prismaData.id,
            texto: prismaData.texto,
            tipo: prismaData.tipo,
            opcoes: prismaData.opcoes === null ? undefined : prismaData.opcoes,
            formularioId: prismaData.formularioId, // importante para relacionamento
            dataCriacao: prismaData.dataCriacao ?? new Date(), // fallback se vier undefined
            dataAtualizacao: prismaData.dataAtualizacao ?? new Date(),
            dataExclusao: prismaData.dataExclusao ?? null,
        });
    }
}

export { PerguntaMap };
