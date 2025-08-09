// src/modules/campanha/application/use-cases/dto/campanha/CampanhaResponseDTO.ts

import { SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";

export interface CampanhaResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  dataInicio: string; // String ISO
  canalEnvio: string;
  dataFim: string | null; // String ISO
  templateMensagem: string;
  formularioId: string;
  ativo: boolean;
  dataCriacao: string; // String ISO
  dataAtualizacao: string; // String ISO
}