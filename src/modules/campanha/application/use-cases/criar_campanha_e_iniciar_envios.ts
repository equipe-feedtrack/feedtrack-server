import { Campanha } from "@modules/campanha/domain/campanha.entity";
import { ICampanhaRepository } from "@modules/campanha/infra/campanha/campanha.repository.interface";
import { Envio } from "@modules/formulario/domain/envioformulario/envio.entity.ts";
import { Formulario } from "@modules/formulario/domain/formulario/formulario.entity";
import { IClienteRepository, IEnvioRepository, IWhatsAppGateway } from "@modules/formulario/infra/envio/IEnvioRepository";
import { IFormularioRepository } from "@modules/formulario/infra/formulario/formulario.repository.interface";
import { ICliente } from "@modules/gestao_clientes/domain/cliente.types";
import { CriarCampanhaInputDTO, CriarCampanhaOutputDTO } from "../dto/criar_campanha_dto";
import { randomUUID } from "crypto";
import { FormularioNaoEncontrado } from "@shared/application/application.exception";

export class CriarCampanhaEIniciarEnviosUseCase { // Nome do Use Case ajustado
  constructor(
    private readonly campanhaRepository: ICampanhaRepository,
    private readonly clienteRepository: IClienteRepository,
    private readonly formularioRepository: IFormularioRepository<Formulario>,
    private readonly envioRepository: IEnvioRepository,             // Injetando o repositório de Envio
    private readonly whatsappGateway: IWhatsAppGateway,           // Injetando o gateway de WhatsApp
  ) {}

  async execute(input: CriarCampanhaInputDTO): Promise<CriarCampanhaOutputDTO> {
    // 1. Validar se o Formulário existe (Agregado Raiz referenciado por FK)
    const formulario = await this.formularioRepository.recuperarPorUuid(input.formularioId);
    if (!formulario) {
      throw new FormularioNaoEncontrado(input.formularioId);
    }

    // 2. Criar a entidade Campanha
    const campanha = Campanha.criar({
      titulo: input.titulo,
      descricao: input.descricao,
      tipoCampanha: input.tipoCampanha,
      segmentoAlvo: input.segmentoAlvo,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim,
      templateMensagem: input.templateMensagem,
      formularioId: input.formularioId,
    });
    await this.campanhaRepository.inserir(campanha); // Persiste a Campanha

    // 3. Obter a lista de Clientes com base no segmento alvo
    const clientesAlvo = await this.clienteRepository.buscarPorSegmento(campanha.segmentoAlvo);
    
    // Lista para rastrear os IDs de envio
    const idsEnviosIniciados: string[] = [];

    // 4. Iniciar o processo de envio para cada cliente alvo
    for (const cliente of clientesAlvo) {
      // 4a. Criar um registro de Envio para rastreamento
      const envio = Envio.criar({
        clienteId: cliente.id,
        usuarioId: "TODO: Obter ID do usuário que iniciou a campanha", // <-- IMPORTANTE: Obtenha o ID do usuário real!
        formularioId: formulario.id,
        feedbackId: randomUUID(), // ID único para este envio específico/coleta de feedback
      });
      idsEnviosIniciados.push(envio.id); // Adiciona à lista de envios iniciados

      // 4b. Persistir o registro de Envio (status PENDENTE)
      await this.envioRepository.salvar(envio);

      // 4c. Tentar enviar a mensagem via WhatsApp
      try {
        const mensagemConteudo = this.personalizarMensagem(campanha.templateMensagem, cliente, formulario); // Personaliza a mensagem
        await this.whatsappGateway.enviar(cliente.telefone, mensagemConteudo); // Assumindo que Cliente tem 'telefone'
        
        // 4d. Marcar Envio como SUCESSO
        envio.marcarComoEnviado();
        await this.envioRepository.atualizar(envio); // Atualiza o status no DB
        console.log(`[Caso de Uso] Mensagem para cliente ${cliente.id} (Envio: ${envio.id}) enviada com sucesso.`);

      } catch (error: any) {
        // 4e. Marcar Envio como FALHA
        const motivoFalha = `Erro ao chamar WhatsApp API: ${error.message || 'Erro desconhecido'}`;
        envio.marcarComoFalha(motivoFalha);
        await this.envioRepository.atualizar(envio); // Atualiza o status no DB
        console.error(`[Caso de Uso] Falha ao enviar mensagem para cliente ${cliente.id} (Envio: ${envio.id}): ${motivoFalha}`);
        // Opcional: Relançar o erro ou apenas logar, dependendo da sua estratégia de resiliência.
        // Aqui, optamos por logar e continuar para os outros clientes.
      }
    }

    console.log(`[Caso de Uso] Campanha '${campanha.titulo}' (ID: ${campanha.id}) criada e envios iniciados para ${clientesAlvo.length} clientes.`);

    return {
      campanhaId: campanha.id,
      titulo: campanha.titulo,
      clientesAssociadosCount: clientesAlvo.length,
      // Opcional: idsEnviosIniciados: idsEnviosIniciados
    };
  }

  // Método auxiliar para personalizar a mensagem
  private personalizarMensagem(template: string, cliente: ICliente, formulario: Formulario): string {
    // Exemplo de personalização: substitui placeholders
    let mensagem = template;
    mensagem = mensagem.replace('{{cliente_nome}}', cliente.pessoa.nome || 'Cliente');
    mensagem = mensagem.replace('{{formulario_titulo}}', formulario.titulo);
    // Adicione mais personalizações conforme necessário (ex: link do feedback)
    // Para um link de feedback, você precisaria do 'envio.feedbackId' que é gerado dentro do loop.
    // Isso pode indicar que a personalização ou a geração do link deveria ser em um serviço separado.

    // Para o link do feedback, se ele for baseado no envioId, a personalização precisa ser no loop.
    // Vamos assumir que o template já tem um placeholder para o link que será preenchido
    // No exemplo, o link seria gerado no serviço de envio, não aqui.
    return mensagem;
  }
}