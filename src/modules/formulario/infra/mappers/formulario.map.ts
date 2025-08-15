import {
  Formulario as FormularioPrisma,
  Prisma,
} from '@prisma/client';

import { FormularioResponseDTO } from '@modules/formulario/application/dto/formulario/FormularioResponseDTO';
import { ListarFormulariosResponseDTO } from '@modules/formulario/application/dto/formulario/ListarFormulariosResponseDTO';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';
import { PerguntaMap } from './pergunta.map';

export class FormularioMap {
  /**
   * Converte o dado bruto do Prisma para a Entidade de Domínio Formulario.
   */
  public static toDomain(raw: FormularioPrisma): Formulario {
    
    // Mapeamento do Formulário, assumindo que no schema a coluna é 'titulo'
    return Formulario.recuperar({
      id: raw.id,
      titulo: raw.titulo, // Assumindo que o campo no Prisma é 'titulo'
      descricao: raw.descricao,
      perguntas: [], // No longer directly associated during creation
      ativo: raw.ativo,
      empresaId: raw.empresaId,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
      dataExclusao: raw.dataExclusao ?? null,
    });
  }

  /**
   * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
   * A gestão da relação com perguntas (usando 'connect' ou 'set') é feita no repositório.
   */
  public static toPersistence(formulario: Formulario) {
    return {
      id: formulario.id,
      titulo: formulario.titulo, // Mapeando 'titulo' do domínio para 'titulo' do Prisma
      descricao: formulario.descricao ?? "",
      ativo: formulario.ativo,
      empresaId: formulario.empresaId,
      // O Prisma client lida com a conversão de nomes (camelCase para snake_case) se @map for usado no schema.
      dataCriacao: formulario.dataCriacao,
      dataAtualizacao: formulario.dataAtualizacao,
      dataExclusao: formulario.dataExclusao,
    };
  }

  /**
   * Converte a entidade Formulario para um DTO de resposta detalhado.
   */
  public static toResponseDTO(formulario: Formulario): FormularioResponseDTO {
    return {
      id: formulario.id,
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      ativo: formulario.ativo,
      empresaId: formulario.empresaId,
      dataCriacao: formulario.dataCriacao.toISOString(),
      dataAtualizacao: formulario.dataAtualizacao.toISOString(),
      // Delega a conversão de cada Pergunta para o PerguntaMap
      perguntas: formulario.perguntas.map(PerguntaMap.toDTO),
    };
  }

  /**
   * Converte a entidade Formulario para um DTO de resposta resumido para listas.
   */
  public static toListDTO(formulario: Formulario): ListarFormulariosResponseDTO {
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