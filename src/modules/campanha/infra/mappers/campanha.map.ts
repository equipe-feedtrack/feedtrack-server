import {
  Campanha as CampanhaPrisma,
  CanalEnvio,
  Prisma,
} from '@prisma/client';

import { Campanha } from '@modules/campanha/domain/campanha.entity';
import { ICampanha, TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { CampanhaCompletaResponseDTO, CampanhaResponseDTO } from '@modules/campanha/application/dto/CampanhaResponseDTO';

// Define um tipo para o objeto CampanhaPrisma que pode ser usado nas conversões.
type CampanhaPrismaDTO = CampanhaPrisma;




export class CampanhaMap {

public static toDomain(raw: CampanhaPrismaDTO): Campanha {


  const campanhaProps: ICampanha = {
    id: raw.id,
    titulo: raw.titulo,
    descricao: raw.descricao ?? undefined,
    templateMensagem: raw.templateMensagem ?? '',
    formularioId: raw.formularioId ?? '',
    canalEnvio: raw.canalEnvio,
    empresaId: raw.empresaId,
    dataCriacao: raw.dataCriacao,
    dataAtualizacao: raw.dataAtualizacao,
    dataExclusao: raw.dataExclusao,
  };

  return Campanha.recuperar(campanhaProps);
}

<<<<<<< HEAD
  /**
   * Converte o dado bruto do Prisma para a Entidade de Domínio Campanha.
   */
  public static toDomain(raw: CampanhaPrismaDTO): Campanha {
    const campanhaProps: ICampanha = {
      id: raw.id,
      titulo: raw.titulo,
      descricao: raw.descricao ?? null,
      tipoCampanha: this.tipoToDomain(raw.tipoCampanha),
      segmentoAlvo: this.segmentoToDomain(raw.segmentoAlvo),
      dataInicio: raw.dataInicio,
      dataFim: raw.dataFim,
      templateMensagem: raw.templateMensagem,
      formularioId: raw.formularioId ?? '',
      canalEnvio: raw.canalEnvio,
      ativo: raw.ativo,
      empresaId: raw.empresaId,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
      dataExclusao: raw.dataExclusao,
    };
=======
>>>>>>> develop


  /**
   * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
   */
  public static toPersistence(campanha: Campanha): Prisma.CampanhaCreateInput {
    return {
      id: campanha.id,
      titulo: campanha.titulo,
      descricao: campanha.descricao,
      canalEnvio: campanha.canalEnvio,
      templateMensagem: campanha.templateMensagem,
      dataCriacao: campanha.dataCriacao,
      dataAtualizacao: campanha.dataAtualizacao,
      dataExclusao: campanha.dataExclusao,
      empresa: { connect: { id: campanha.empresaId } },
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
      templateMensagem: campanha.templateMensagem,
      formularioId: campanha.formularioId,
      canalEnvio: campanha.canalEnvio,
      empresaId: campanha.empresaId,
      dataCriacao: new Date(campanha.dataCriacao).toISOString(),
      dataAtualizacao: new Date(campanha.dataAtualizacao).toISOString(),
    };
  }

    public static toDomainParcial(raw: Partial<CampanhaPrismaDTO>): Partial<Campanha> {
    if (!raw.id) throw new Error("ID da campanha é obrigatório.");
    return {
      id: raw.id,
      canalEnvio: raw.canalEnvio,
      templateMensagem: raw.templateMensagem ?? '',
      empresaId: raw.empresaId,
    } as Partial<Campanha>;
  }

public static toDomainWithFormulario(raw: any): Campanha {
  const campanha = this.toDomain({
    ...raw,
    templateMensagem: raw.templateMensagem ?? '',
  });

  // Preencher o formulário com perguntas
  if (raw.formulario) {
    campanha['formulario'] = {
      id: raw.formulario.id,
      perguntas: raw.formulario.perguntas.map((p: any) => ({
        id: p.pergunta.id,
        texto: p.pergunta.texto,
        tipo: p.pergunta.tipo,
        opcoes: p.pergunta.opcoes ?? [],
      })),
    };
  }

  return campanha;
}

public static toResponseWithFormulario(campanha: Campanha): CampanhaCompletaResponseDTO {
  return {
    ...this.toResponseDTO(campanha),
    formulario: campanha.formulario ?? undefined,
  };
}



}