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
        data_criacao: dadosParaPersistencia.data_criacao,
        data_atualizacao: dadosParaPersistencia.data_atualizacao,
        data_exclusao: dadosParaPersistencia.data_exclusao,
        ativo: dadosParaPersistencia.ativo,
       cliente_id: dadosParaPersistencia.cliente_id,
      },
    });
  }

  /**
   * Recupera um Produto pelo seu ID único.
   */
  async recuperarPorUuid(id: string): Promise<IProduto | null> {
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
        data_atualizacao: dadosParaPersistencia.data_atualizacao,
        data_exclusao: dadosParaPersistencia.data_exclusao, // Pode ser null
        ativo: dadosParaPersistencia.ativo,
        cliente_id: dadosParaPersistencia.cliente_id, // Pode ser null
      },
    });
  }

  // ... (outros métodos da interface IProdutoRepository) ...
}