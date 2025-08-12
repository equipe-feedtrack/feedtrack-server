import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

 interface IPerguntaRepository {
  // Métodos de escrita
  inserir(pergunta: Pergunta): Promise<void>;
  atualizar(pergunta: Pergunta): Promise<void>;
  deletar(id: string): Promise<void>;

  // Métodos de leitura
  recuperarPorUuid(id: string): Promise<Pergunta | null>;
  buscarMuitosPorId(ids: string[]): Promise<Pergunta[]>;
  listar(filtros?: { ativo?: boolean }): Promise<Pergunta[]>;
  
  // Métodos de verificação
  existe(id: string): Promise<boolean>;
}

export { IPerguntaRepository };
