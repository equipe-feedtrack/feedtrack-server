import { Envio_formulario as EnvioPrisma } from '@prisma/client';
import { EnvioResponseDTO } from "../application/use-cases/dto/envio/iniciarEnvioDTO.js";
import { Envio } from "../domain/envioformulario/domain/envio.entity.ts.js";

export class EnvioMap {
  public static toDomain(raw: EnvioPrisma): Envio {
    // @ts-ignore // O construtor é privado, mas o Mapper tem permissão para usá-lo
    return new Envio({
      id: raw.id,
      clienteId: raw.clienteId,
      usuarioId: raw.usuarioId,
      formularioId: raw.formularioId,
      feedbackId: raw.feedbackId,
      status: raw.status as 'PENDENTE' | 'ENVIADO' | 'FALHA',
      dataCriacao: raw.dataCriacao,
      dataEnvio: raw.dataEnvio,
      tentativasEnvio: raw.tentativasEnvio,
      ultimaMensagemErro: raw.ultimaMensagemErro,
    });
  }

  public static toPersistence(envio: Envio) {
    return {
      id: envio.props.id,
      clienteId: envio.props.clienteId,
      usuarioId: envio.props.usuarioId,
      formularioId: envio.props.formularioId,
      feedbackId: envio.props.feedbackId,
      status: envio.props.status,
      dataCriacao: envio.props.dataCriacao,
      dataEnvio: envio.props.dataEnvio,
      tentativasEnvio: envio.props.tentativasEnvio,
      ultimaMensagemErro: envio.props.ultimaMensagemErro,
    };
  }
    
  public static toDTO(envio: Envio): EnvioResponseDTO {
      return {
          id: envio.id,
          status: envio.status,
          feedbackId: envio.feedbackId,
          clienteId: envio.clienteId,
          formularioId: envio.props.formularioId,
          dataCriacao: envio.props.dataCriacao.toISOString(),
          dataEnvio: envio.props.dataEnvio ? envio.props.dataEnvio.toISOString() : null,
          erro: envio.props.ultimaMensagemErro,
      }
  }
}