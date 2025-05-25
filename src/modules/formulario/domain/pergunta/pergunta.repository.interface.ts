import { IRepository } from "@shared/domain/repository.inteface";

interface IPerguntaRepository<T> extends IRepository<T> {

    // Quando eu for fazer contratos específicos tem que ser aqui, por exemplo recuperar somente perguntas que tenham multiplas escolhas e foi definido na minha regra de negócio.
}

export { IPerguntaRepository }