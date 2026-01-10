import { IEnvioRepository } from "@modules/formulario/infra/envio/IEnvioRepository";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity";

export class ListarEnviosPorEmpresaUseCase {
  constructor(private readonly envioRepository: IEnvioRepository) {}

  async execute(empresaId: string): Promise<Envio[]> {
    return this.envioRepository.buscarPorEmpresaId(empresaId);
  }
}
