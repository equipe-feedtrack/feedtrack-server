import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";
import { TipoPergunta } from "@shared/domain/data.types";

/**
 * Representa um feedback completo (instância da entidade).
 * Deve conter todos os dados, inclusive datas e relacionamento com Formulário e Pergunta.
 */
interface IFeedback {
  id?: string;
  formulario: Formulario;
  pergunta: Pergunta;
  tipo: TipoPergunta;
  resposta_texto?: string;
  nota?: number;
  data_resposta: Date;
  opcaoEscolhida?: string;
}

/**
 * Dados necessários para criar um novo feedback.
 * Não exige `id` nem `data_resposta` pois são definidos pela entidade.
 */
type IFeedbackProps = Omit<IFeedback, "id" | "data_resposta">;

/**
 * Usado para reidratar o Feedback a partir de dados persistidos (banco).
 * Todos os campos são obrigatórios.
 */
type IRecuperarFeedbackProps = IFeedback;

/**
 * Estrutura enviada ao frontend (DTO).
 * Contém apenas IDs de entidades relacionadas.
 */
interface FeedbackDTO {
  id: string;
  formularioId: string;
  perguntaId: string;
  tipo: TipoPergunta;
  resposta_texto?: string;
  nota?: number;
  opcaoEscolhida?: string;
  data_resposta: Date;
}

export {
  IFeedback,
  IFeedbackProps,
  IRecuperarFeedbackProps,
  FeedbackDTO
};
