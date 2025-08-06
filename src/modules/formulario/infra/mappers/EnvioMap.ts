import { EnvioResponseDTO } from '@modules/formulario/application/dto/envio/iniciarEnvioDTO';
import { Envio } from '@modules/formulario/domain/envioformulario/envio.entity.ts';
import { EnvioProps } from '@modules/formulario/domain/envioformulario/envioFormulario.types';
import {
  EnvioFormulario as EnvioPrisma,
  StatusFormulario as StatusFormularioPrisma,
  Prisma,
} from '@prisma/client';



export class EnvioMap {

  /**
   * Converte o dado bruto do Prisma para a Entidade de Domínio Envio.
   */
  public static toDomain(raw: EnvioPrisma): Envio {
    const envioProps: EnvioProps = {
      id: raw.id,
      status: raw.status,
      feedbackId: raw.feedbackId,
      clienteId: raw.clienteId,
      formularioId: raw.formularioId,
      usuarioId: raw.usuarioId,
      dataCriacao: raw.dataCriacao,
      dataEnvio: raw.dataEnvio,
      tentativasEnvio: raw.tentativasEnvio,
      ultimaMensagemErro: raw.ultimaMensagemErro,
    };

    return Envio.recuperar(envioProps);
  }

  /**
   * Converte a Entidade de Domínio para o formato que o Prisma espera para persistência.
   */
  public static toPersistence(envio: Envio): Prisma.EnvioFormularioCreateInput {
    return {
      id: envio.id,
      status: envio.status,
      dataCriacao: envio.dataCriacao,
      dataEnvio: envio.dataEnvio,
      tentativasEnvio: envio.tentativasEnvio,
      ultimaMensagemErro: envio.ultimaMensagemErro,
      // Conecta as relações com as outras entidades
      cliente: {
        connect: { id: envio.clienteId },
      },
      formulario: {
        connect: { id: envio.formularioId },
      },
      usuario: {
        connect: { id: envio.usuarioId },
      },
      feedback: {
        connect: { id: envio.feedbackId },
      },
    };
  }

  /**
   * Converte a entidade Envio para um DTO de resposta da API.
   */
  public static toResponseDTO(envio: Envio): EnvioResponseDTO {
    return {
      id: envio.id,
      status: envio.status,
      feedbackId: envio.feedbackId,
      clienteId: envio.clienteId,
      formularioId: envio.formularioId,
      usuarioId: envio.usuarioId,
      dataCriacao: envio.dataCriacao.toISOString(),
      dataEnvio: envio.dataEnvio ? envio.dataEnvio.toISOString() : null,
      tentativasEnvio: envio.tentativasEnvio,
      ultimaMensagemErro: envio.ultimaMensagemErro,
    };
  }
}
