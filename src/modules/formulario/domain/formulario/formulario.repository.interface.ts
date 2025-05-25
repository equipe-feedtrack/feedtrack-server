import { IRepository } from "@shared/domain/repository.inteface";

interface IFormularioRepository<T> extends IRepository<T> {

    // Quando eu for fazer contratos específicos tem que ser aqui, por exemplo recuperar somente formulários que foram enviados para pessoas coom letra A, algo que foi definido na minha regra de negócio.
}

export { IFormularioRepository }