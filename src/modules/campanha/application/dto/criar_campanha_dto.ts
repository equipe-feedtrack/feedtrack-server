import { SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";

export interface CriarCampanhaInputDTO {
  titulo: string;
  descricao?: string;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  dataInicio: Date;
  dataFim?: Date | null;
  templateMensagem: string;
  formularioId: string; // ID do formulário a ser associado
}

export interface CriarCampanhaOutputDTO {
  campanhaId: string;
  titulo: string;
  clientesAssociadosCount: number; // Quantidade de clientes que se enquadram no segmento
}