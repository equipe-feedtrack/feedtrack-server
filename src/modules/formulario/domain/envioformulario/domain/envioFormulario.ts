import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { Entity } from "@shared/domain/entity";
import { IEnvioFormularioProps } from "./envioFormulario.types";

class EnvioFormulario extends Entity<IEnvioFormularioProps> {
  private _data_envio: Date;
  private _destinatario: string;
  private _formulario: Formulario;
  private _canal: "email" | "whatsapp" | string;

  public get data_envio() {
    return this._data_envio;
  }

  public get destinatario() {
    return this._destinatario;
  }

  public get formulario() {
    return this._formulario;
  }

  public get canal() {
    return this._canal;
  }

  private constructor(props: IEnvioFormularioProps) {
    super(props.id);
    this._data_envio = props.data_envio;
    this._destinatario = props.destinatario;
    this._formulario = props.formulario;
    this._canal = props.canal;
  }

  // Método estático para criar uma nova instância, gerando o id se precisar
  public static criar(props: IEnvioFormularioProps): EnvioFormulario {
    const id = props.id
    return new EnvioFormulario({
      ...props,
      id,
    });
  }
}

export { EnvioFormulario, IEnvioFormularioProps };
