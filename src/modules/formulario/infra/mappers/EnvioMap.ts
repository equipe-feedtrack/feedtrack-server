// src/modules/formulario/infra/mappers/envio.map.ts

import { EnvioFormulario as EnvioPrisma, Prisma, StatusFormulario } from '@prisma/client';
import { Envio } from '@modules/formulario/domain/envioformulario/envio.entity';
import { IEnvio } from '@modules/formulario/domain/envioformulario/envioFormulario.types';

export class EnvioMap {
  /**
   * Converte um objeto do Prisma para a Entidade de Domínio Envio.
   */
  public static toDomain(raw: EnvioPrisma): Envio {
    const envioProps: IEnvio = {
      id: raw.id,
      status: raw.status,
      feedbackId: null, // Esta propriedade agora existe e é mapeada
      produtoId: raw.produtoId ?? '',
      clienteId: raw.clienteId ?? '',
      formularioId: raw.formularioId ?? '',
      campanhaId: raw.campanhaId ?? '',
      usuarioId: raw.usuarioId ?? '',
      dataCriacao: raw.dataCriacao,
      dataEnvio: raw.dataEnvio,
      tentativasEnvio: raw.tentativasEnvio,
      ultimaMensagemErro: raw.ultimaMensagemErro,
    };
    return Envio.recuperar(envioProps, raw.id);
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
      cliente: { connect: { id: envio.clienteId } },
      formulario: { connect: { id: envio.formularioId } },
      campanha: { connect: { id: envio.campanhaId } },
      usuario: { connect: { id: envio.usuarioId } },
    };
  }
}
