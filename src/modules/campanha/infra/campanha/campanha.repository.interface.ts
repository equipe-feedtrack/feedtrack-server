import { Campanha } from "@modules/campanha/domain/campanha.entity";
import { ICampanha } from "@modules/campanha/domain/campanha.types";

export interface ICampanhaRepository {
  /**
   * Insere ou atualiza uma Campanha no mecanismo de persistência.
   * @param campanha A entidade Campanha a ser persistida.
   */
  inserir(campanha: Campanha): Promise<void>;

  /**
   * Recupera uma Campanha pelo seu identificador único.
   * @param id O ID da Campanha a ser recuperada.
   * @returns A entidade Campanha, ou null se não encontrada.
   */
  recuperarPorUuid(id: string): Promise<ICampanha | null>;

  // --- Métodos Adicionais que você pode precisar ---
  /**
   * Lista Campanhas com base em filtros (opcionalmente).
   * @param filtros Um objeto com critérios de filtro (ex: { ativo: true, tipo: TipoCampanha.PROMOCIONAL }).
   * @returns Uma lista de entidades Campanha.
   */
  listar?(filtros?: any): Promise<ICampanha[]>;

  /**
   * Verifica se uma Campanha com um dado ID existe.
   * @param id O ID da Campanha a ser verificada.
   * @returns Verdadeiro se existir, falso caso contrário.
   */
  existe?(id: string): Promise<boolean>;

  /**
   * Atualiza parcialmente uma Campanha existente.
   * Nota: Muitos repositórios DDD preferem 'inserir' para upsert ou métodos de comportamento na própria entidade.
   * @param id O ID da Campanha a ser atualizada.
   * @param entity Parte da entidade com os dados a serem atualizados.
   * @returns Verdadeiro se a atualização for bem-sucedida, falso caso contrário.
   */
  atualizar(entity: Partial<ICampanha>): Promise<void>;

  /**
   * Exclui (logicamente ou fisicamente) uma Campanha.
   * @param id O ID da Campanha a ser excluída.
   * @returns Verdadeiro se a exclusão for bem-sucedida, falso caso contrário.
   */
  deletar(id: string): Promise<void>;
}