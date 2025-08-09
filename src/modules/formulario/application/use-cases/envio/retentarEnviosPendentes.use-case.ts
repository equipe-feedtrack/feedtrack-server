import { IEnvioRepository } from "@modules/formulario/infra/envio/IEnvioRepository";

/**
 * @description Use Case para retentar o envio de formulários que estão com o status PENDENTE ou FALHA.
 * Este use case é ideal para ser executado por um scheduler (job).
 */
export class RetentarEnviosPendentesUseCase {
  constructor(private readonly envioRepository: IEnvioRepository) {}

  public async execute(): Promise<void> {
    const enviosPendentes = await this.envioRepository.buscarPendentes(); // Este método precisa ser adicionado ao repositório

    if (enviosPendentes.length === 0) {
      console.log("Nenhum envio pendente para retentar.");
      return;
    }

    console.log(`Retentando ${enviosPendentes.length} envios pendentes.`);

    const operacoes = enviosPendentes.map(async envio => {
      try {
        console.log(`Simulando retentativa de envio para ${envio.clienteId}`);
        // Lógica de retentativa aqui
        envio.marcarComoEnviado();
      } catch (error: any) {
        envio.registrarFalha(error.message);
      }
      return envio;
    });

    const enviosAtualizados = await Promise.all(operacoes);
    await this.envioRepository.salvarVarios(enviosAtualizados);
  }
}