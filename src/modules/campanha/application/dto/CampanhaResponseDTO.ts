import {SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";
import { CanalEnvio } from '@prisma/client';

export interface CampanhaResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  canalEnvio: CanalEnvio;
  dataFim: string | null; // String ISO
  templateMensagem: string;
  formularioId: string;
  ativo: boolean;
  empresaId: string;
  dataCriacao: string; // String ISO
  dataAtualizacao: string; // String ISO
}