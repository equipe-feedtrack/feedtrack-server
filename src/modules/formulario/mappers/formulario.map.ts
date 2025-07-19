import { Formulario } from "../domain/formulario/formulario.entity";
import { IFormulario, RecuperarFormularioProps } from "../domain/formulario/formulario.types";
import { Pergunta } from "../domain/pergunta/domain/pergunta.entity";
import { IPergunta } from "../domain/pergunta/domain/pergunta.types";
import { PerguntaMap } from "./pergunta.map";

class FormularioMap {
    public static toDTO(formulario: Formulario): IFormulario {
  const perguntasDTO: IPergunta[] = formulario.perguntas.map(p => PerguntaMap.toDTO(p));
  return {
    id: formulario.id,
    titulo: formulario.titulo,
    descricao: formulario.descricao ?? '',
    perguntas: perguntasDTO,
    ativo: formulario.ativo,
    dataCriacao: formulario.dataCriacao,
    dataAtualizacao: formulario.dataAtualizacao,
    dataExclusao: formulario.dataExclusao ?? null,
  };
}

    public static toDomain(formulario: RecuperarFormularioProps): Formulario {
        return Formulario.recuperar({
            ...formulario,
            perguntas: formulario.perguntas?.map(p => 
                PerguntaMap.toDomain({
                    id: p.id,
                    texto: p.texto,
                    tipo: p.tipo,
                    opcoes: p.opcoes,
                    formularioId: p.formularioId,
                    dataCriacao: p.dataCriacao,
                    dataAtualizacao: p.dataAtualizacao,
                    dataExclusao: p.dataExclusao,
                })
            ) ?? [],
        });
    }
}


export { FormularioMap };

