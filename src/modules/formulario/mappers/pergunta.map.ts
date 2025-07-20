import { Pergunta as PerguntaPrisma, Prisma } from '@prisma/client';
import { Pergunta } from '../domain/pergunta/domain/pergunta.entity';
import { IPergunta } from '../domain/pergunta/domain/pergunta.types';
import { PerguntaResponseDTO } from '../application/use-cases/dto/pergunta/PerguntaResponseDTO';
 // Usaremos a interface de Props da entidade

export class PerguntaMap {
  /**
   * Converte uma entidade de domínio Pergunta para um DTO (Data Transfer Object).
   * O DTO é um objeto simples para ser usado pela camada de apresentação (ex: API).
   */
    public static toDTO(pergunta: Pergunta): PerguntaResponseDTO {
    // 2. O tipo de retorno agora é PerguntaResponseDTO
    return {
      id: pergunta.id,
      texto: pergunta.texto,
      tipo: pergunta.tipo,
      // 3. Converte 'null' em 'undefined' para respeitar o DTO
      opcoes: pergunta.opcoes ?? undefined,
      // 4. Converte as datas para o formato string ISO 8601
      dataCriacao: pergunta.dataCriacao.toISOString(),
      dataAtualizacao: pergunta.dataAtualizacao.toISOString(),
      // O campo dataExclusao não faz parte do DTO de resposta, então é omitido.
    };
  }

  /**
   * Converte dados crus do Prisma para uma entidade de domínio Pergunta.
   * Usado para "hidratar" a entidade após uma consulta ao banco.
   */
  public static toDomain(raw: PerguntaPrisma): Pergunta {
    // CORREÇÃO: Usamos o tipo 'PerguntaPrisma' (raw) e seus campos em snake_case.
    return Pergunta.recuperar({
      id: raw.id,
      texto: raw.texto,
      tipo: raw.tipo as 'nota' | 'texto' | 'multipla_escolha',
      // Tratamento seguro para o tipo JsonValue do Prisma
      opcoes: Array.isArray(raw.opcoes) ? raw.opcoes.map(String) : undefined,
      // CORREÇÃO: Passamos as datas diretamente, sem fallbacks perigosos.
      dataCriacao: raw.data_criacao,
      dataAtualizacao: raw.data_atualizacao,
      dataExclusao: raw.data_exclusao,
    });
  }
  public static toPersistence(pergunta: Pergunta) {
    // Aqui fazemos a "tradução" de camelCase (domínio) para snake_case (banco).
    return {
      id: pergunta.id,
      texto: pergunta.texto,
      tipo: pergunta.tipo,
      opcoes: pergunta.opcoes ?? Prisma.JsonNull,
      data_criacao: pergunta.dataCriacao,
      data_atualizacao: pergunta.dataAtualizacao,
      data_exclusao: pergunta.dataExclusao,
    };
  }
}