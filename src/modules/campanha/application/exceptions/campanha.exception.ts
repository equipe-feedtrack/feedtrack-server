import { ApplicationException } from "@shared/application/application.exception";

export class CampanhaNaoEncontradaException extends ApplicationException {
    constructor(message: string = 'Campanha não encontrada.') {
        super(message);
        this.name = 'CampanhaNaoEncontradaException';
    }
}
