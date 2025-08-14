import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '@shared/infra/prisma.repository';
import { IProdutoRepository } from './produto.repository.interface';
import { ProdutoMap } from './mappers/produto.map';
import { Produto } from '../domain/produto.entity';
import { IProduto } from '../domain/produto.types';


export class ProdutoRepositoryPrisma extends PrismaRepository implements IProdutoRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Insere um novo Produto no banco de dados.
   */
  async inserir(produto: Produto): Promise<void> {
    const dadosParaPersistencia = ProdutoMap.toPersistence(produto);

    await this._datasource.produto.create({ // <-- Acesso ao modelo 'produto' no Prisma
      data: {
        id: dadosParaPersistencia.id,
        nome: dadosParaPersistencia.nome,
        descricao: dadosParaPersistencia.descricao,
        valor: dadosParaPersistencia.valor,
        dataCriacao: dadosParaPersistencia.data_criacao,
        dataAtualizacao: dadosParaPersistencia.data_atualizacao,
        dataExclusao: dadosParaPersistencia.data_exclusao,
        ativo: dadosParaPersistencia.ativo,
        empresaId: dadosParaPersistencia.empresaId,
      },
    });
  }

  /**
   * Recupera um Produto pelo seu ID único.
   */
  async recuperarPorUuid(id: string): Promise<Produto | null> {
    const produtoPrisma = await this._datasource.produto.findUnique({ 
      where: { id },
    });

    if (!produtoPrisma) return null;

    return ProdutoMap.toDomain(produtoPrisma);
  }

  /**
   * Atualiza um Produto existente no banco de dados.
   */
  async atualizar(produto: Produto): Promise<void> {
    const dadosParaPersistencia = ProdutoMap.toPersistence(produto);

    await this._datasource.produto.update({ // <-- Acesso ao modelo 'produto'
      where: { id: produto.id },
      data: {
        nome: dadosParaPersistencia.nome,
        descricao: dadosParaPersistencia.descricao,
        valor: dadosParaPersistencia.valor,
        dataAtualizacao: dadosParaPersistencia.data_atualizacao,
        dataExclusao: dadosParaPersistencia.data_exclusao, // Pode ser null
        ativo: dadosParaPersistencia.ativo,
        empresaId: dadosParaPersistencia.empresaId,
      },
    });
  }
  
  async listar(filtros?: any): Promise<Produto[]> {
    const whereClause: any = {};

    if (filtros?.status) {
      whereClause.status = filtros.status; // Filtra por status
    }
    if (filtros?.ativo !== undefined) {
      whereClause.ativo = filtros.ativo; // Filtra por ativo
    }
    if (filtros?.empresaId) {
      whereClause.empresaId = filtros.empresaId; // Filtra por empresaId
    }
    // Adicione mais lógica de filtro aqui

    const produtosPrisma = await this._datasource.produto.findMany({
      where: whereClause,
    });
    return produtosPrisma.map(ProdutoMap.toDomain);
  }

  // ... (outros métodos da interface IProdutoRepository) ...
}
