import { FeedbackResponseDTO } from "@modules/feedbacks/application/dto/criarFeedbackDTO";
import { Feedback } from "@modules/feedbacks/domain/feedback.entity";
import { RecuperarFeedbackProps } from "@modules/feedbacks/domain/feedback.types";
import { Feedback as FeedbackPrisma, Prisma } from '@prisma/client';

export class FeedbackMap {

  /**
   * Converte um objeto do Prisma para a Entidade de Domínio Feedback.
   * Ele lida com a tradução dos campos do banco (snake_case) para o domínio (camelCase).
   */
  public static toDomain(raw: FeedbackPrisma): Feedback {
    // Prisma já retorna o campo JSON como um objeto, então não precisamos de JSON.parse.
    const props: RecuperarFeedbackProps = {
      id: raw.id,
      formularioId: raw.formularioId,
      envioId: raw.envioId ?? null, // Adicionado para consistência
      respostas: raw.respostas as Record<string, any>[],
      dataCriacao: raw.dataCriacao,
      dataExclusao: raw.dataExclusao ?? null,
      clienteNome: raw.cliente_nome,
      produtoNome: raw.produto_nome,
      funcionarioNome: raw.funcionario_nome,
    };
    return Feedback.recuperar(props);
  }

  /**
   * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
   * Ele lida com a tradução dos campos do domínio (camelCase) para o banco (snake_case).
   */
  public static toPersistence(feedback: Feedback) {
    return {
      id: feedback.id,
      formularioId: feedback.formularioId,
      envioId: feedback.envioId ?? null, // Adicionado para consistência
      respostas: feedback.respostas as Prisma.InputJsonValue,
      dataCriacao: feedback.dataCriacao,
      dataExclusao: feedback.dataExclusao ?? null,
      cliente_nome: feedback.clienteNome,
      produto_nome: feedback.produtoNome,
      funcionario_nome: feedback.funcionarioNome,
    };
  }

  /**
   * Converte a entidade de domínio para um DTO de resposta da API.
   */
public static toResponseDTO(feedback: Feedback): FeedbackResponseDTO {
  return {
    id: feedback.id,
    formularioId: feedback.formularioId,
    envioId: feedback.envioId ?? null,
    respostas: feedback.respostas,
    dataCriacao: feedback.dataCriacao.toISOString(),
    dataExclusao: feedback.dataExclusao ? feedback.dataExclusao.toISOString() : undefined,
    clienteNome: feedback.clienteNome,
    produtoNome: feedback.produtoNome,
    funcionarioNome: feedback.funcionarioNome,
  };
}

}