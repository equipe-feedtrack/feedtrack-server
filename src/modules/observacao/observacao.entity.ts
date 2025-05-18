class Observacao {
    
    // Atributos //

    private _id: number;
    private _relatorio_id: number;
    private _conteudo: string;
    private _origem: Origem;
    private _tipo: Tipo;

    public get id(): number {
        return this._id;
    }

    private set id(value: number) {
        this._id = value;
    }

    public get relatorio_id(): number {
        return this._relatorio_id;
    }

    private set relatorio_id(value: number) {
        this._relatorio_id = value;
    }

    public get conteudo(): string {
        return this._conteudo;
    }

    private set conteudo(value: string) {
        this._conteudo = value;
    }

    public get origem(): Origem {
        return this._origem;
    }

    private set origem(value: Origem) {
        this._origem = value;
    }

    public get tipo(): Tipo {
        return this._tipo;
    }

    private set tipo(value: Tipo) {
        this._tipo = value;
    }

    constructor(id: number, relatorio_id: number, conteudo: string, origem: Origem, tipo: Tipo) {
        id = this.id;
        relatorio_id = this.relatorio_id;
        conteudo = this.conteudo;
        origem = this.origem;
        tipo = this.tipo;
    }

    // Métodos // 
    

}


enum Origem {
    
    feedback,
    relatorio,
    manual,	
    sistema,
    evento
}

enum Tipo {
  
    alerta,
    elogio,
    sugestao,
    informativo,
    acao
}

export{Observacao}