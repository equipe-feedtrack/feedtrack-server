import { Campanha as CampanhaPrisma, Prisma } from '@prisma/client';
import { Campanha } from "@modules/campanha/domain/campanha.entity";
import { RecuperarCampanhaProps, SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";
import { CampanhaResponseDTO } from '@modules/campanha/application/dto/CampanhaResponseDTO';


export class CampanhaMap {
  /**
   * Converte o dado bruto do Prisma (CampanhaPrisma) para a Entidade de Domínio Campanha.
   * Usado para "hidratar" a entidade após uma consulta ao banco de dados.
   */
  public static toDomain(raw: CampanhaPrisma): Campanha {
    // Converte os enums do formato do DB para o formato de domínio
    const tipoCampanha = raw.tipo_campanha as TipoCampanha;
    const segmentoAlvo = raw.segmento_alvo as SegmentoAlvo;
    console.log('MAPPER - templateMensagem em raw.template_mensagem:', raw.template_mensagem); // LOG 2

    const props: RecuperarCampanhaProps = {
      id: raw.id,
      titulo: raw.titulo,
      descricao: raw.descricao ?? undefined, // DB pode ser null, domínio pode ser undefined
      tipoCampanha: tipoCampanha,
      segmentoAlvo: segmentoAlvo,
      dataInicio: raw.data_inicio,
      dataFim: raw.data_fim ?? null, // DB pode ser null, domínio também pode ser null
      templateMensagem: raw.template_mensagem,
      formularioId: raw.formularioId, // FK para Formulário
      ativo: raw.ativo,
      dataCriacao: raw.data_criacao,
      dataAtualizacao: raw.data_atualizacao,
      dataExclusao: raw.data_exclusao ?? null,
    };
    return Campanha.recuperar(props);
  }

  /**
   * Converte a Entidade de Domínio Campanha para o formato que o Prisma espera para persistência.
   * O objeto retornado aqui usa snake_case para os nomes das colunas conforme o schema.prisma.
   */
  public static toPersistence(campanha: Campanha) {
    return {
    id: campanha.id,
    titulo: campanha.titulo,
    descricao: campanha.descricao ?? null,
    tipo_campanha: campanha.tipoCampanha, // mapeado para snake_case
    segmento_alvo: campanha.segmentoAlvo, // mapeado para snake_case
    data_inicio: campanha.dataInicio,     // mapeado para snake_case
    data_fim: campanha.dataFim ?? null,   // mapeado para snake_case
    template_mensagem: campanha.templateMensagem, // mapeado para snake_case
    formularioId: campanha.formularioId,  // é FK, pode ser camelCase ou snake_case se não @map
    ativo: campanha.ativo,
    data_criacao: campanha.dataCriacao,   // mapeado para snake_case
    data_atualizacao: campanha.dataAtualizacao, // mapeado para snake_case
    data_exclusao: campanha.dataExclusao, // mapeado para snake_case
    };
  }

  /**
   * Converte a Entidade de Domínio Campanha para um DTO de resposta.
   * Este DTO é usado para enviar dados da Campanha para a camada de apresentação (API).
   */
  public static toResponseDTO(campanha: Campanha): CampanhaResponseDTO {
    return {
      id: campanha.id,
      titulo: campanha.titulo,
      descricao: campanha.descricao ?? undefined, // DTOs geralmente preferem undefined para campos ausentes
      tipoCampanha: campanha.tipoCampanha,
      segmentoAlvo: campanha.segmentoAlvo,
      dataInicio: campanha.dataInicio.toISOString(), // Converte Date para string ISO
      dataFim: campanha.dataFim ? campanha.dataFim.toISOString() : undefined, // Converte Date para string ISO ou undefined
      templateMensagem: campanha.templateMensagem,
      formularioId: campanha.formularioId,
      ativo: campanha.ativo,
      dataCriacao: campanha.dataCriacao.toISOString(),
      dataAtualizacao: campanha.dataAtualizacao.toISOString(),
      // 'dataExclusao' geralmente não é incluído em DTOs de resposta de sucesso
    };
  }
}