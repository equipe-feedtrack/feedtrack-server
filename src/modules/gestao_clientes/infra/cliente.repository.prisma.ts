import { SegmentoAlvo } from '@modules/campanha/domain/campanha.types'; // O enum SegmentoAlvo
import { ClienteMap } from './mappers/cliente.map';
import { Cliente } from '../domain/cliente.entity';
import { PrismaRepository } from '@shared/infra/prisma.repository';
import { ICliente } from '../domain/cliente.types';
import { IClienteRepository } from './cliente.repository.interface';
import { PrismaClient, Cliente as ClientePrisma } from '@prisma/client';

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
        produtos: {
          connect: cliente.produtos.map(produto => ({ id: produto.id })),
        },
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
        produtos: {
          set: cliente.produtos.map(produto => ({ id: produto.id })),
        },
        // Para atualizar produtos (relação 1-N), pode ser necessário um método separado
        // ou usar 'set' ou 'disconnect' no relacionamento, dependendo da operação.
      },
    });
  }

  /**
   * Implementa a lógica para buscar clientes por segmento alvo.
   * Isso será usado pelo caso de uso de Campanha.
   */
  async buscarPorSegmento(segmento: SegmentoAlvo): Promise<Cliente[]> {
    let clientesPrisma: ClientePrisma[];

    switch (segmento) {
      case SegmentoAlvo.TODOS_CLIENTES:
        clientesPrisma = await this._datasource.cliente.findMany({
          include: { produtos: true },
        });
        break;
      case SegmentoAlvo.NOVOS_CLIENTES: // Mantenha apenas este case para NOVOS_CLIENTES
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30); // Lógica para últimos 30 dias
        clientesPrisma = await this._datasource.cliente.findMany({
          where: {
            data_criacao: {
              gte: trintaDiasAtras,
            },
            status: 'ATIVO', // Sempre buscar ativos
          },
          include: { produtos: true },
        });
        break;
      case SegmentoAlvo.CLIENTES_REGULARES:
        const trintaDiasAtrasParaRegulares = new Date();
        trintaDiasAtrasParaRegulares.setDate(trintaDiasAtrasParaRegulares.getDate() - 30);
        clientesPrisma = await this._datasource.cliente.findMany({
          where: {
            data_criacao: { lt: trintaDiasAtrasParaRegulares }, // Mais antigos que 30 dias
            status: 'ATIVO',
          },
          include: { produtos: true },
        });
        break;
      case SegmentoAlvo.CLIENTES_PREMIUM:
        // Exemplo: Clientes com um status específico 'PREMIUM'
        clientesPrisma = await this._datasource.cliente.findMany({
          where: { status: 'ATIVO' /* && alguma outra condição para premium */ }, // Ajuste para sua lógica Premium
          include: { produtos: true },
        });
        break;
      default:
        // Padrão se o segmento não for reconhecido ou se quiser buscar todos os ativos
        clientesPrisma = await this._datasource.cliente.findMany({
            where: { status: 'ATIVO' },
            include: { produtos: true },
        });
        break;
    }

    return clientesPrisma.map(ClienteMap.toDomain);
}

  async existe(id: string): Promise<boolean> {
    const count = await this._datasource.cliente.count({
      where: { id },
    });
    return count > 0;
  }

  // Você pode adicionar outros métodos da interface IClienteRepository aqui (listar, existe, deletar).
}