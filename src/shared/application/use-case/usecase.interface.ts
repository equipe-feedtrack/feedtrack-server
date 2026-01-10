/**
 * Interface genérica para um Caso de Uso (Use Case).
 * Define um contrato padrão para todas as operações da camada de aplicação,
 * garantindo uma arquitetura limpa e consistente.
 *
 * @template TInput O tipo de dado de entrada (Input DTO) que o caso de uso espera.
 * @template TOutput O tipo de dado de saída (Output DTO) que o caso de uso retornará.
 */
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
