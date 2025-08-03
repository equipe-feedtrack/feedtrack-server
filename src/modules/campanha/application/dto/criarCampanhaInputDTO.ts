import { SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";

export interface CriarCampanhaInputDTO {
  titulo: string;
  descricao?: string;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  dataInicio: Date;
  dataFim: Date | null;
  templateMensagem: string;
  formularioId: string;
}