import { Pergunta } from "@modules/formulario/domain/pergunta/pergunta.entity";

interface IPerguntaRepository {
  // Métodos de escrita
  inserir(pergunta: Pergunta): Promise<void>;
  atualizar(pergunta: Pergunta): Promise<void>;
  deletar(id: string, empresaId: string): Promise<void>; // empresaId obrigatório para deletar

  // Métodos de leitura
  recuperarPorUuid(id: string, empresaId: string): Promise<Pergunta | null>;
  buscarMuitosPorId(ids: string[], empresaId: string): Promise<Pergunta[]>;
  listar(empresaId: string): Promise<Pergunta[]>; // empresaId obrigatório
  
  // Métodos de verificação
  existe(id: string, empresaId: string): Promise<boolean>; // verifica somente dentro da empresa
}

export { IPerguntaRepository };
