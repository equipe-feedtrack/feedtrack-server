import { Formulario as FormularioPrisma } from '@prisma/client';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';
import { PerguntaMap } from './pergunta.map';

export class FormularioMap {
  public static toDomain(
    raw: FormularioPrisma & { perguntas: { pergunta: any }[] } // <- inclui perguntas
  ): Formulario {
    return Formulario.recuperar({
      id: raw.id,
      titulo: raw.titulo,
      descricao: raw.descricao,
      ativo: raw.ativo,
      empresaId: raw.empresaId,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
      dataExclusao: raw.dataExclusao ?? null,
      perguntas: raw.perguntas.map(pf => PerguntaMap.toDomain(pf.pergunta)), // <- mapeia as perguntas
    });
  }

  public static toPersistence(formulario: Formulario) {
    return {
      id: formulario.id,
      titulo: formulario.titulo,
      descricao: formulario.descricao ?? "",
      ativo: formulario.ativo,
      empresaId: formulario.empresaId,
      dataCriacao: formulario.dataCriacao,
      dataAtualizacao: formulario.dataAtualizacao,
      dataExclusao: formulario.dataExclusao,
    };
  }

  public static toResponseDTO(formulario: Formulario) {
    return {
      id: formulario.id,
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      ativo: formulario.ativo,
      empresaId: formulario.empresaId,
      dataCriacao: formulario.dataCriacao.toISOString(),
      dataAtualizacao: formulario.dataAtualizacao.toISOString(),
      perguntas: formulario.perguntas.map(PerguntaMap.toDTO),
    };
  }

  public static toListDTO(formulario: Formulario) {
    return {
      id: formulario.id,
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      ativo: formulario.ativo,
      empresaId: formulario.empresaId,
      dataCriacao: formulario.dataCriacao.toISOString(),
      perguntas: formulario.perguntas.map(PerguntaMap.toDTO),
    };
  }
}
