import { Campanha } from "@modules/campanha/domain/campanha.entity";

export interface ICampanhaRepository {
  /**
   * Insere uma Campanha no mecanismo de persistência.
   * @param campanha A entidade Campanha a ser persistida.
   */
  inserir(campanha: Campanha): Promise<void>;

  /**
   * Recupera uma Campanha pelo seu ID e empresaId.
   * @param id O ID da Campanha.
   * @param empresaId O ID da empresa associada.
   * @returns A entidade Campanha, ou null se não encontrada.
   */
  recuperarPorUuid(id: string, empresaId: string): Promise<Campanha | null>;

  /**
   * Lista todas as Campanhas de uma empresa específica.
   * @param empresaId O ID da empresa.
   * @returns Uma lista de entidades Campanha.
   */
  listar(empresaId: string): Promise<Campanha[]>;

  /**
   * Verifica se uma Campanha com um dado ID existe.
   * @param id O ID da Campanha.
   * @param empresaId O ID da empresa associada.
   * @returns Verdadeiro se existir, falso caso contrário.
   */
  existe(id: string, empresaId: string): Promise<boolean>;

  /**
   * Atualiza uma Campanha existente.
   * @param campanha A entidade Campanha com os dados a serem atualizados.
   */
  atualizar(campanha: Campanha): Promise<void>;

  /**
   * Exclui (logicamente ou fisicamente) uma Campanha.
   * @param id O ID da Campanha.
   * @param empresaId O ID da empresa associada.
   */
  deletar(id: string, empresaId: string): Promise<void>;

  recuperarParcial(id: string, empresaId: string): Promise<Partial<Campanha> | null>;
}
