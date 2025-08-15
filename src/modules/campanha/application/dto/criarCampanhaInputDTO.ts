import { SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";
import { CanalEnvio } from '@prisma/client';

export interface CriarCampanhaInputDTO {
  titulo: string;
  descricao?: string;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  dataInicio: Date;
  dataFim: Date | null;
  templateMensagem: string;
  formularioId: string;
  canalEnvio: CanalEnvio;
  empresaId: string;
}