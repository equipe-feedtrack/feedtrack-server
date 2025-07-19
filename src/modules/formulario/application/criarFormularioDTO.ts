import { Tipo } from "@modules/usuario/domain/usuario/usuario.types";

interface CriarFormularioDTO {
  titulo: string;
  descricao?: string;
  perguntas: CriarPerguntaDTO[];
  ativo?: boolean;  // opcional, pode ter valor padrão
}
interface CriarPerguntaDTO {
  texto: string;
  tipo: Tipo
  opcoes?: string[];
}

export {CriarFormularioDTO, CriarPerguntaDTO}