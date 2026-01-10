import { Produto } from "../domain/produto.entity";
import { IProduto } from "../domain/produto.types";

export interface IProdutoRepository {
  /**
   * Insere um novo Produto no mecanismo de persistência.
   * @param produto A entidade Produto a ser inserida.
   */
  inserir(produto: Produto): Promise<void>;

  /**
   * Recupera um Produto pelo seu ID único.
   * @param id O ID do Produto a ser recuperado.
   * @returns A entidade Produto (IProduto), ou null se não encontrada.
   */
  recuperarPorUuid(id: string, empresaId: string): Promise<Produto | null>;

  /**
   * Atualiza um Produto existente no mecanismo de persistência.
   * @param produto A entidade Produto com os dados a serem atualizados.
   */
  atualizar(produto: Produto): Promise<void>;

  listar(filtros?: any): Promise<Produto[]>;

  deletar(id: string): Promise<void>;
}