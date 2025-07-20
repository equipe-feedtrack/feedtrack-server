import {
  Formulario as FormularioPrisma,
  Pergunta as PerguntaPrisma,
} from '@prisma/client';
import { Formulario } from '../domain/formulario/formulario.entity';
import { Pergunta } from '../domain/pergunta/domain/pergunta.entity';
import { FormularioResponseDTO } from '../application/use-cases/dto/formulario/FormularioResponseDTO';
import { PerguntaMap } from './pergunta.map';
import { ListarFormulariosResponseDTO } from '../application/use-cases/dto/formulario/ListarFormulariosResponseDTO';


type FormularioComPerguntas = FormularioPrisma & { perguntas: PerguntaPrisma[] };

export class FormularioMap {
  /**
   * Converte o dado bruto do Prisma para a Entidade de Domínio.
   */
  public static toDomain(raw: FormularioComPerguntas): Formulario {

    const perguntas = raw.perguntas.map((p_prisma) =>
      Pergunta.recuperar({
        id: p_prisma.id,
        texto: p_prisma.texto,
        tipo: p_prisma.tipo as 'nota' | 'texto' | 'multipla_escolha',
        opcoes: Array.isArray(p_prisma.opcoes) ? p_prisma.opcoes.map(String) : undefined,
        dataCriacao: p_prisma.data_criacao,
        dataAtualizacao: p_prisma.data_atualizacao,
        dataExclusao: p_prisma.data_exclusao,
      })
    );

    // 2. Mapeamento do Formulário
     return Formulario.recuperar({
      id: raw.id,
      titulo: raw.texto,
      descricao: raw.descricao,
      perguntas: perguntas,
      ativo: raw.ativo,
      dataCriacao: raw.data_criacao,
      dataAtualizacao: raw.data_atualizacao,
      dataExclusao: raw.data_exclusao ?? null,
    });
  }

  /**
   * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
   */
  public static toPersistence(formulario: Formulario) {
    // CORREÇÃO: Garantimos que o dado enviado ao Prisma corresponde ao schema.
    // Se o seu Prisma espera 'texto' para o título, usamos 'texto'.
    return {
      id: formulario.id,
      texto: formulario.titulo, // Mapeando 'titulo' do domínio para 'texto' do Prisma
      descricao: formulario.descricao ?? " ",
      ativo: formulario.ativo,
      data_criacao: formulario.dataCriacao,
      data_atualizacao: formulario.dataAtualizacao,
      data_exclusao: formulario.dataExclusao,
    };
  }

   public static toResponseDTO(formulario: Formulario): FormularioResponseDTO {
    return {
      id: formulario.id,
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      ativo: formulario.ativo,
      dataCriacao: formulario.dataCriacao.toISOString(),
      dataAtualizacao: formulario.dataAtualizacao.toISOString(),
      // Mapeia cada entidade Pergunta para seu respectivo DTO
      perguntas: formulario.perguntas.map(pergunta => PerguntaMap.toDTO(pergunta)),
    };
  }

   public static toListDTO(formulario: Formulario): ListarFormulariosResponseDTO {
    return {
      id: formulario.id,
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      ativo: formulario.ativo,
      dataCriacao: formulario.dataCriacao.toISOString(),
      // Calcula a quantidade de perguntas sem expor os detalhes de cada uma
      quantidadePerguntas: formulario.perguntas.length,
    };
  }
}