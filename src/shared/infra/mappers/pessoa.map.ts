import { Pessoa } from "@shared/domain/pessoa.entity";
import { PessoaProps } from "@shared/domain/pessoa.types";

export class PessoaMap {

  /**
   * Converte um objeto de dados brutos (do Prisma, que contém os dados da Pessoa) para a entidade de domínio Pessoa.
   * @param raw Dados brutos (ex: ClientePrisma) que contêm as propriedades da Pessoa.
   * @returns Uma entidade Pessoa.
   */
  public static toDomain(raw: { nome: string; email: string | null; telefone: string }): Pessoa {
    const pessoaProps: PessoaProps = {
      nome: raw.nome,
      email: raw.email ?? undefined,
      telefone: raw.telefone,
    };
    return Pessoa.recuperar(pessoaProps); // Usa o método de recuperação da entidade Pessoa
  }

  /**
   * Converte a entidade de domínio Pessoa para um objeto de persistência (partes que vão para ClientePrisma).
   * @param pessoa A entidade Pessoa.
   * @returns Um objeto com as propriedades da Pessoa no formato do Prisma.
   */
  public static toPersistence(pessoa: Pessoa) {
    return {
      nome: pessoa.nome,
      email: pessoa.email ?? null,
      telefone: pessoa.telefone,
      // Se Pessoa tivesse ID próprio e fosse uma relação, seria pessoaId: pessoa.id
    };
  }

  /**
   * Converte a entidade de domínio Pessoa para um DTO de resposta (ex: para ClienteResponseDTO).
   * @param pessoa A entidade Pessoa.
   * @returns Um DTO com as propriedades essenciais da Pessoa.
   */
  public static toDTO(pessoa: Pessoa) {
    return {
      nome: pessoa.nome,
      email: pessoa.email,
      telefone: pessoa.telefone,
    };
  }
}