import { PerguntaResponseDTO } from '@modules/formulario/application/dto/pergunta/PerguntaResponseDTO';
import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';
import { RecuperarPerguntaProps } from '@modules/formulario/domain/pergunta/pergunta.types';
import { Pergunta as PerguntaPrisma, Prisma } from '@prisma/client';

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
      ativo: pergunta.ativo,
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
    const tipoPergunta = raw.tipo as 'nota' | 'texto' | 'multipla_escolha';
    let opcoesTratadas: string[] | undefined | null;

    if (tipoPergunta === 'nota') {
      // Se for uma pergunta tipo 'nota':
      // Se raw.opcoes for null/undefined/vazio do banco, aplique o padrão.
      if (!raw.opcoes || (Array.isArray(raw.opcoes) && raw.opcoes.length === 0)) {
        opcoesTratadas = ['1', '2', '3', '4', '5'];
      } else {
        // Se houver opções customizadas para 'nota', use-as (garantindo que são strings)
        opcoesTratadas = Array.isArray(raw.opcoes) ? raw.opcoes.map(String) : undefined;
      }
    } else if (tipoPergunta === 'texto') {
      // Perguntas tipo 'texto' nunca devem ter opções.
      opcoesTratadas = undefined;
    } else {
      // Para 'multipla_escolha' e outros tipos, use o que veio do banco.
      opcoesTratadas = Array.isArray(raw.opcoes) ? raw.opcoes.map(String) : undefined;
    }

    const propsParaEntidade: RecuperarPerguntaProps = {
      id: raw.id,
      texto: raw.texto,
      tipo: tipoPergunta,
      opcoes: opcoesTratadas, // Passa as opções já tratadas
      ativo: raw.ativo,
      dataCriacao: raw.data_criacao,
      dataAtualizacao: raw.data_atualizacao,
      dataExclusao: raw.data_exclusao,
    };

    // A entidade Pergunta.recuperar apenas "hidrata" com os dados já preparados.
    return Pergunta.recuperar(propsParaEntidade);
  }

  public static toPersistence(pergunta: Pergunta) {
    // Aqui fazemos a "tradução" de camelCase (domínio) para snake_case (banco).
    return {
      id: pergunta.id,
      texto: pergunta.texto,
      tipo: pergunta.tipo,
      opcoes: pergunta.opcoes ?? Prisma.JsonNull,
      ativo: pergunta.ativo,
      data_criacao: pergunta.dataCriacao,
      data_atualizacao: pergunta.dataAtualizacao,
      data_exclusao: pergunta.dataExclusao,
    };
  }
}