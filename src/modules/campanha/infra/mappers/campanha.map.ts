import {
  Campanha as CampanhaPrisma,
  TipoCampanha as TipoCampanhaPrisma,
  SegmentoAlvo as SegmentoAlvoPrisma,
  Prisma,
} from '@prisma/client';

import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { ICampanha, TipoCampanha, SegmentoAlvo, CanalEnvio } from '@modules/campanha/domain/campanha.types';
import { CampanhaResponseDTO } from '@modules/campanha/application/dto/CampanhaResponseDTO';

// Define um tipo para o objeto CampanhaPrisma que pode ser usado nas conversões.
type CampanhaPrismaDTO = CampanhaPrisma;

export class CampanhaMap {

  // Funções privadas para mapear enums de forma segura, evitando acoplamento frágil.
  private static tipoToDomain(tipo: TipoCampanhaPrisma): TipoCampanha {
    return tipo as unknown as TipoCampanha; // Mapeamento direto se os nomes forem idênticos
  }

  private static tipoToPersistence(tipo: TipoCampanha): TipoCampanhaPrisma {
    return tipo as unknown as TipoCampanhaPrisma;
  }

  private static segmentoToDomain(segmento: SegmentoAlvoPrisma): SegmentoAlvo {
    return segmento as unknown as SegmentoAlvo;
  }

  private static segmentoToPersistence(segmento: SegmentoAlvo): SegmentoAlvoPrisma {
    return segmento as unknown as SegmentoAlvoPrisma;
  }

  /**
   * Converte o dado bruto do Prisma para a Entidade de Domínio Campanha.
   */
  public static toDomain(raw: CampanhaPrismaDTO): Campanha {
    const campanhaProps: ICampanha = {
      id: raw.id,
      titulo: raw.titulo,
      descricao: raw.descricao ?? undefined,
      tipoCampanha: this.tipoToDomain(raw.tipoCampanha),
      segmentoAlvo: this.segmentoToDomain(raw.segmentoAlvo),
      dataInicio: raw.dataInicio,
      dataFim: raw.dataFim,
      templateMensagem: raw.templateMensagem,
      formularioId: raw.formularioId,
      canalEnvio: raw.canalEnvio as CanalEnvio,
      ativo: raw.ativo,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
      dataExclusao: raw.dataExclusao,
    };

    return Campanha.recuperar(campanhaProps);
  }

  /**
   * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
   */
  public static toPersistence(campanha: Campanha): Prisma.CampanhaCreateInput {
    return {
      id: campanha.id,
      titulo: campanha.titulo,
      descricao: campanha.descricao,
      tipoCampanha: this.tipoToPersistence(campanha.tipoCampanha),
      segmentoAlvo: this.segmentoToPersistence(campanha.segmentoAlvo),
      dataInicio: campanha.dataInicio,
      dataFim: campanha.dataFim,
      templateMensagem: campanha.templateMensagem,
      canalEnvio: campanha.canalEnvio,
      ativo: campanha.ativo,
      dataCriacao: campanha.dataCriacao,
      dataAtualizacao: campanha.dataAtualizacao,
      dataExclusao: campanha.dataExclusao,
      // A conexão com o formulário é feita através do ID
      formulario: {
        connect: { id: campanha.formularioId },
      },
    };
  }

  /**
   * Converte a entidade Campanha para um DTO de resposta da API.
   */
  public static toResponseDTO(campanha: Campanha): CampanhaResponseDTO {
    return {
      id: campanha.id,
      titulo: campanha.titulo,
      descricao: campanha.descricao,
      tipoCampanha: campanha.tipoCampanha,
      segmentoAlvo: campanha.segmentoAlvo,
      dataInicio: new Date(campanha.dataInicio).toISOString(),
      dataFim: campanha.dataFim ? new Date(campanha.dataFim).toISOString() : null,
      templateMensagem: campanha.templateMensagem,
      formularioId: campanha.formularioId,
      canalEnvio: campanha.canalEnvio,
      ativo: campanha.ativo,
      dataCriacao: new Date(campanha.dataCriacao).toISOString(),
      dataAtualizacao: new Date(campanha.dataAtualizacao).toISOString(),
    };
  }
}
