import { PrismaRepository } from "@shared/infra/prisma.repository";
import { Pergunta } from "../domain/pergunta/pergunta.entity";
import { IPerguntaRepository } from "../domain/pergunta/pergunta.repository.interface";

class PerguntaPrismaRepository extends PrismaRepository implements IPerguntaRepository<Pergunta> {
    async recuperarPorUuid(uuid: string): Promise<Pergunta | null> {
        throw new Error("Method not implemented.");
    }
    async recuperarTodos(): Promise<Pergunta[]> {
        throw new Error("Method not implemented.");
    }
    async existe(uuid: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async inserir(entity: Pergunta): Promise<Pergunta> {
        throw new Error("Method not implemented.");
    }
    async atualizar(uuid: string, entity: Partial<Pergunta>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async deletar(uuid: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}