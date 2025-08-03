import { randomUUID } from 'crypto';
import { EnvioProps } from './envioFormulario.types';
import { StatusFormulario } from '@prisma/client';

class Envio {
  public readonly props: EnvioProps;

  public get id(): string { return this.props.id; }
  public get status(): StatusFormulario { return this.props.status; }
  public get feedbackId(): string { return this.props.feedbackId; }
  public get clienteId(): string { return this.props.clienteId; }
  public get formularioId(): string { return this.props.formularioId; } // <-- Getters existentes
  public get usuarioId(): string { return this.props.usuarioId; }     // <-- Getters existentes
  public get dataCriacao(): Date { return this.props.dataCriacao; }    // <-- ADICIONE/CONFIRME ESTE GETTER
  public get dataEnvio(): Date | null | undefined { return this.props.dataEnvio; }
  public get tentativasEnvio(): number { return this.props.tentativasEnvio; } // <-- ADICIONE/CONFIRME ESTE GETTER
  public get ultimaMensagemErro(): string | null | undefined { return this.props.ultimaMensagemErro; }
  
  private constructor(props: EnvioProps) {
    this.props = props;
  }

  public static criar(props: { clienteId: string; usuarioId: string; formularioId: string; feedbackId: string }): Envio {
    const envioProps: EnvioProps = {
      id: randomUUID(),
      ...props,
      status: 'PENDENTE',
      dataCriacao: new Date(),
      dataEnvio: null,
      ultimaMensagemErro: null,
      tentativasEnvio: 0,
    };
    return new Envio(envioProps);
  }

  public static recuperar(props: EnvioProps): Envio {
  if (!props.id || props.id.trim() === '') { throw new Error("ID é obrigatório para recuperar um Envio."); }
  if (!props.formularioId || props.formularioId.trim() === '') { throw new Error("ID do formulário é obrigatório para recuperar um Envio."); }
  if (!props.clienteId || props.clienteId.trim() === '') { throw new Error("ID do cliente é obrigatório para recuperar um Envio."); }
  if (!props.usuarioId || props.usuarioId.trim() === '') { throw new Error("ID do usuário é obrigatório para recuperar um Envio."); }
  if (!props.feedbackId || props.feedbackId.trim() === '') { throw new Error("ID do feedback é obrigatório para recuperar um Envio."); }
  if (!props.status) { throw new Error("Status é obrigatório para recuperar um Envio."); }
  if (!props.dataCriacao || !(props.dataCriacao instanceof Date) || isNaN(props.dataCriacao.getTime())) { throw new Error("Data de criação é obrigatória e válida para recuperar um Envio."); }
  // tentativasEnvio é number, pode ter default 0, mas se vier null/undefined aqui, pode precisar de validação
  if (typeof props.tentativasEnvio !== 'number' || props.tentativasEnvio < 0) { throw new Error("Tentativas de envio inválidas para recuperar um Envio."); }

  return new Envio(props);
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