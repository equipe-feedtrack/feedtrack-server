import { SegmentoAlvo } from '@modules/campanha/domain/campanha.types'; // O enum SegmentoAlvo
import { ClienteMap } from './mappers/cliente.map';
import { Cliente } from '../domain/cliente/cliente.entity';
import { PrismaRepository } from '@shared/infra/prisma.repository';
import { ICliente } from '../domain/cliente/cliente.types';
import { IClienteRepository } from './i_cliente_repository';
import { PrismaClient } from '@prisma/client';

export class ClienteRepositoryPrisma extends PrismaRepository implements IClienteRepository {
  constructor(prismaClient: PrismaClient) { 
    super(prismaClient); 
  }

  /**
   * Insere um novo Cliente no banco de dados.
   * Assumimos que, para 'inserir', o Cliente ainda não existe no DB.
   */
  async inserir(cliente: Cliente): Promise<void> {
    const dadosParaPersistencia = ClienteMap.toPersistence(cliente);

    // O Prisma model Cliente no schema.prisma tem nome, email, telefone diretos
    // O ClienteMap.toPersistence já formata isso corretamente.
    await this._datasource.cliente.create({
      data: {
        id: dadosParaPersistencia.id,
        nome: dadosParaPersistencia.nome,
        telefone: dadosParaPersistencia.telefone,
        email: dadosParaPersistencia.email,
        cidade: dadosParaPersistencia.cidade,
        status: dadosParaPersistencia.status, // Enum
        vendedor_responsavel: dadosParaPersistencia.vendedorResponsavel,
        data_criacao: dadosParaPersistencia.data_criacao,
        data_atualizacao: dadosParaPersistencia.data_atualizacao,
        data_exclusao: dadosParaPersistencia.data_exclusao,
        // Produtos (relação N-N) e Envio_formulario (relação 1-N)
        // serão gerenciados em seus próprios repositórios ou via o FormularioRepository
        // ao conectar/setar, não diretamente aqui na criação do Cliente.
      },
    });
  }

  /**
   * Recupera um Cliente pelo seu ID único.
   */
  async recuperarPorUuid(id: string): Promise<ICliente | null> {
    // Incluir 'produtos' é crucial para reconstruir a entidade Cliente completamente.
    // O relacionamento 'produtos' é 1-N para Cliente->Produto, então o Cliente é o "pai".
    const clientePrisma = await this._datasource.cliente.findUnique({
      where: { id },
      include: { produtos: true }, // Inclui os produtos relacionados
    });

    if (!clientePrisma) return null;

    // O ClienteMap.toDomain espera ClientePrisma e os produtos incluídos
    return ClienteMap.toDomain(clientePrisma);
  }

  /**
   * Atualiza um Cliente existente no banco de dados.
   * Este método é para atualizações parciais ou completas de um Cliente.
   * Podemos usar 'upsert' aqui ou um 'update' direto. Optaremos por 'update' direto para ser semântico.
   */
  async atualizar(cliente: Cliente): Promise<void> {
    const dadosParaPersistencia = ClienteMap.toPersistence(cliente);

    await this._datasource.cliente.update({
      where: { id: cliente.id },
      data: {
        nome: dadosParaPersistencia.nome,
        telefone: dadosParaPersistencia.telefone,
        email: dadosParaPersistencia.email,
        cidade: dadosParaPersistencia.cidade,
        status: dadosParaPersistencia.status,
        vendedor_responsavel: dadosParaPersistencia.vendedorResponsavel,
        data_atualizacao: dadosParaPersistencia.data_atualizacao, // Apenas data de atualização
        data_exclusao: dadosParaPersistencia.data_exclusao,
        // Para atualizar produtos (relação 1-N), pode ser necessário um método separado
        // ou usar 'set' ou 'disconnect' no relacionamento, dependendo da operação.
      },
    });
  }

  /**
   * Implementa a lógica para buscar clientes por segmento alvo.
   * Isso será usado pelo caso de uso de Campanha.
   */
  async buscarPorSegmento(segmento: SegmentoAlvo): Promise<ICliente[]> {
    let whereClause: any = {}; // Onde definimos a lógica de filtro
    const now = new Date();

    switch (segmento) {
      case SegmentoAlvo.TODOS_CLIENTES:
        // Nenhuma cláusula WHERE específica, busca todos os ativos
        whereClause = { status: 'ATIVO' };
        break;
      case SegmentoAlvo.NOVOS_CLIENTES:
        // Exemplo: Clientes criados nos últimos 30 dias e ativos
        const trintaDiasAtras = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        whereClause = {
          data_criacao: { gte: trintaDiasAtras },
          status: 'ATIVO',
        };
        break;
      case SegmentoAlvo.CLIENTES_REGULARES:
        // Exemplo: Clientes ativos que não são "novos" (criados há mais de 30 dias)
        // Isso é uma lógica simplificada e pode precisar de mais dados (histórico de compras, etc.)
        const trintaDiasAtrasParaRegulares = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        whereClause = {
          data_criacao: { lt: trintaDiasAtrasParaRegulares }, // Mais antigos que 30 dias
          status: 'ATIVO',
        };
        break;
      case SegmentoAlvo.CLIENTES_PREMIUM:
        // Exemplo: Clientes com um status específico 'PREMIUM' e ativos
        // Assumindo que Status_usuarios tem um valor 'PREMIUM' ou você tem outro campo para isso.
        // Se 'PREMIUM' não for um Status_usuarios, isso exigiria um campo ou relação dedicada.
        // Por agora, vamos buscar clientes ativos com uma lógica placeholder.
        whereClause = { status: 'ATIVO' /* && alguma outra condição para premium */ };
        break;
      default:
        whereClause = { status: 'ATIVO' }; // Default para ativos
        break;
    }

    // Incluir produtos relacionados ao buscar clientes
    const clientesPrisma = await this._datasource.cliente.findMany({
      where: whereClause,
      include: { produtos: true }, // Inclui os produtos para mapeamento
    });

    // Mapeia cada ClientePrisma (com seus produtos) para a entidade de domínio Cliente
    return clientesPrisma.map(ClienteMap.toDomain);
  }

  // Você pode adicionar outros métodos da interface IClienteRepository aqui (listar, existe, deletar).
}