import { Feedback } from '@modules/feedbacks/domain/feedback.entity';
import { FeedbackExceptions } from '@modules/feedbacks/domain/feedback.exceptions';
import { IFeedbackRepository } from '@modules/feedbacks/infra/feedback.repository';
import { FeedbackMap } from '@modules/feedbacks/infra/mappers/feedback.map';
import { Envio } from '@modules/formulario/domain/envioformulario/envio.entity.ts';
import { Formulario } from '@modules/formulario/domain/formulario/formulario.entity';
import { IEnvioRepository } from '@modules/formulario/infra/envio/IEnvioRepository';
import { IFormularioRepository } from '@modules/formulario/infra/formulario/formulario.repository.interface';
import { FeedbackResponseDTO } from '../dto/FeedbackResponseDTO';
import { RegistrarFeedbackInputDTO } from '../dto/registrar_feedback_input.dto';

export class RegistrarFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: IFeedbackRepository,
    private readonly envioRepository: IEnvioRepository, // Repositório para Envio_formulario
    private readonly formularioRepository: IFormularioRepository<Formulario>, // Repositório para Formulário
  ) {}

  async execute(input: RegistrarFeedbackInputDTO): Promise<FeedbackResponseDTO> {
    // 1. Validar a existência do registro de Envio_formulario
    const envioProps = await this.envioRepository.buscarPorId(input.envioId);
    if (!envioProps) {
      throw new FeedbackExceptions.EnvioNaoEncontrado(input.envioId); // Exceção específica
    }
    const envio = Envio.recuperar(envioProps); // Reconstroi a entidade Envio

    // 2. Verificar se já existe um Feedback registrado para este envio
    const feedbackExistente = await this.feedbackRepository.recuperarPorUuid(input.envioId);
    if (feedbackExistente) {
      throw new FeedbackExceptions.FeedbackJaRegistrado(input.envioId); // Exceção específica
    }

    // 3. Validar a existência do Formulário associado ao Envio (regra de negócio)
    const formulario = await this.formularioRepository.recuperarPorUuid(envio.formularioId);
    if (!formulario) {
      throw new FeedbackExceptions.FormularioAssociadoInvalido(envio.formularioId); // Exceção específica
    }

    // 4. Criar a entidade Feedback.
    // A validação dos campos dentro de 'input.respostas' (perguntaId, tipo, etc.)
    // ocorrerá dentro do método 'Feedback.criar'.
    const feedback = Feedback.criar({
      formularioId: envio.formularioId, // FK para o Formulário do Envio
      resposta: input.respostas, // Passa o JSON de respostas completo
    });

    // 5. Persistir o Feedback
    await this.feedbackRepository.inserir(feedback);

    // 6. Opcional: Atualizar o status do Envio_formulario para indicar que o feedback foi recebido
    // A entidade Envio deve ter um método para isso.
    envio.marcarComoEnviado(); // <-- Assume que Envio tem esse método
    await this.envioRepository.atualizar(envio); // Persiste a atualização no DB

    console.log(`[Caso de Uso] Feedback para Envio ${input.envioId} registrado com ID ${feedback.id}.`);

    return FeedbackMap.toResponseDTO(feedback);
  }
}