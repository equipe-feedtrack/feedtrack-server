import { PrismaRepository } from "@shared/infra/prisma.repository";
import { IFormularioRepository } from "../domain/formulario/formulario.repository.interface";
import { Formulario } from "../domain/formulario/formulario.entity";

class FormularioPrismaRepository extends PrismaRepository implements IFormularioRepository<Formulario> {
    recuperarPorUuid(uuid: string): Promise<Formulario | null> {
        throw new Error("Method not implemented.");
    }
    recuperarTodos(): Promise<Formulario[]> {
        throw new Error("Method not implemented.");
    }
    existe(uuid: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    inserir(entity: Formulario): Promise<Formulario> {
        throw new Error("Method not implemented.");
    }
    atualizar(uuid: string, entity: Partial<Formulario>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deletar(uuid: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }


}