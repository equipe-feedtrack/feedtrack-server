/**
 * Interface genérica para um Caso de Uso (Use Case).
 * Define um contrato padrão para todas as operações da camada de aplicação,
 * garantindo uma arquitetura limpa e consistente.
 *
 * @template TInput O tipo de dado de entrada (Input DTO) que o caso de uso espera.
 * @template TOutput O tipo de dado de saída (Output DTO) que o caso de uso retornará.
 */
export interface IUseCase<TInput, TOutput> {
  /**
   * Executa a lógica do caso de uso.
   * @param input Os dados de entrada necessários para a operação.
   * @returns Uma promessa que resolve com os dados de saída da operação.
   */
  execute(input: TInput): Promise<TOutput>;
}