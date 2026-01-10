import {SegmentoAlvo, TipoCampanha } from "@modules/campanha/domain/campanha.types";
import { CanalEnvio } from '@prisma/client';

export interface CampanhaResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  canalEnvio: CanalEnvio;
  templateMensagem: string;
  formularioId: string;
  empresaId: string;
  dataCriacao: string; // String ISO
  dataAtualizacao: string; // String ISO
}

export interface CampanhaCompletaResponseDTO extends CampanhaResponseDTO {
  formulario?: {
    id: string;
    perguntas: { texto: string; tipo: string; opcoes: string[] }[];
  };
}
