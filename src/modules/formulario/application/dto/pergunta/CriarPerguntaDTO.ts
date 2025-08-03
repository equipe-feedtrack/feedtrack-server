import { TipoPergunta } from "@shared/domain/data.types";

export interface CriarPerguntaInputDTO {
  texto: string;
  tipo: 'nota' | 'texto' | 'multipla_escolha';
  opcoes?: string[] | null;
}