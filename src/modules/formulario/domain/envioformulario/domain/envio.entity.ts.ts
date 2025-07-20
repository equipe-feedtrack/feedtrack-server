import { randomUUID } from 'crypto';
import { EnvioProps } from './envioFormulario.types';
import { Status_formulario } from '@prisma/client';

class Envio {
  public readonly props: EnvioProps;

  public get id(): string { return this.props.id; }
  public get status(): Status_formulario { return this.props.status; }
  public get feedbackId(): string { return this.props.feedbackId; }
  public get clienteId(): string { return this.props.clienteId; }
  
  private constructor(props: EnvioProps) {
    this.props = props;
  }

  public static criar(props: { clienteId: string; usuarioId: string; formularioId: string; feedbackId: string }): Envio {
    const envioProps: EnvioProps = {
      id: randomUUID(),
      ...props,
      status: 'PENDENTE',
      dataCriacao: new Date(),
      tentativasEnvio: 0,
    };
    return new Envio(envioProps);
  }

  public marcarComoEnviado(): void {
    if (this.props.status === 'ENVIADO') return; // Evita múltiplas marcações
    this.props.status = 'ENVIADO';
    this.props.dataEnvio = new Date();
    this.props.ultimaMensagemErro = null;
  }

  public marcarComoFalha(motivo: string): void {
    this.props.status = 'FALHA';
    this.props.tentativasEnvio += 1;
    this.props.ultimaMensagemErro = motivo;
  }

}

export { Envio }