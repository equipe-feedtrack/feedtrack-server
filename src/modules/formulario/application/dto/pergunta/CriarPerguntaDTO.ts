import { TipoPergunta } from "@shared/domain/data.types";

export interface CriarPerguntaInputDTO {
  _texto: string;
  _tipo: 'nota' | 'texto' | 'multipla_escolha';
  _opcoes?: string[] | null;
}