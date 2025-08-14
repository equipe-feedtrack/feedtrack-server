import { SegmentoAlvo } from "@modules/campanha/domain/campanha.types";
import { Cliente } from "../domain/cliente.entity";

export interface IClienteRepository {
  /**
   * Insere um novo Cliente no mecanismo de persistência.
   * @param cliente A entidade Cliente a ser inserida.
   */
  inserir(cliente: Cliente): Promise<void>;

  /**
   * Recupera um Cliente pelo seu ID único.
   * @param id O ID do Cliente a ser recuperado.
   * @returns A entidade Cliente (ICliente), ou null se não encontrada.
   */
  recuperarPorUuid(id: string): Promise<Cliente | null>;

  /**
   * Atualiza um Cliente existente no mecanismo de persistência.
   * Usado para persistir mudanças de estado da entidade.
   * @param cliente A entidade Cliente com os dados a serem atualizados.
   */
  atualizar(cliente: Cliente): Promise<void>;

  /**
   * Busca clientes que pertencem a um segmento alvo específico.
   * Este método é crucial para a funcionalidade de Campanha.
   * @param segmento O segmento alvo (ex: TODOS_CLIENTES, NOVOS_CLIENTES).
   * @returns Uma Promise que resolve para uma lista de entidades Cliente (ICliente[]).
   */
  buscarPorSegmento(segmento: SegmentoAlvo, empresaId?: string): Promise<Cliente[]>;

  // --- Métodos Adicionais que você pode precisar (opcionais, mas comuns) ---
  /**
   * Verifica se um Cliente com um dado ID existe.
   * @param id O ID do Cliente a ser verificado.
   * @returns Verdadeiro se existir, falso caso contrário.
   */
  existe(id: string): Promise<boolean>;

  /**
   * Lista Clientes com base em filtros.
   * @param filtros Um objeto com critérios de filtro.
   * @returns Uma lista de entidades Cliente (ICliente[]).
   */
  listar(filtros?: any): Promise<Cliente[]>;

  buscarClientesParaCampanha(segmento: SegmentoAlvo): Promise<Cliente[]>;

  /**
   * Exclui (logicamente ou fisicamente) um Cliente pelo seu ID.
   * @param id O ID do Cliente a ser excluído.
   * @returns Verdadeiro se a exclusão for bem-sucedida, falso caso contrário.
   */
  deletar?(id: string): Promise<boolean>;
}