class Relatorio {
    
    //Atributos//
   private _id: number;
   private _tipo_relatorio: number;
   private _filtro: string;
   private _data_geracao: Date;


    public get id(): number {
        return this._id;
    }

    private set id(value: number) {
        this._id = value;
    }

    public get tipo_relatorio(): number {
        return this._tipo_relatorio;
    }

    private set tipo_relatorio(value: number) {
        this._tipo_relatorio = value;
    }

    public get filtro(): string {
        return this._filtro;
    }

    private set filtro(value: string) {
        this._filtro = value;
    }

    public get data_geracao(): Date {
        return this._data_geracao;
    }

    private set data_geracao(value: Date) {
        this._data_geracao = value;
    }

}

export {Relatorio};