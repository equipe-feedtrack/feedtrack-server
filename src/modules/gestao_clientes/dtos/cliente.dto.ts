export class CreateClientDTO {
    constructor(
        public nome: string,
        public telefone2: string,
        public email:string,
        public preferencias2: string | Record<string, any>
    ) {}
}