import { EnvioFormulario } from "../domain/envioFormulario";

interface IEnvioFormularioService {
  enviar(envio: EnvioFormulario): Promise<void>;
}

export { IEnvioFormularioService };