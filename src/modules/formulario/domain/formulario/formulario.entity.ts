import { Pergunta } from "../pergunta/pergunta.entity";
import { CriarFormularioProps, IFormulario } from "./formulario.types";


class Formulario implements IFormulario{
    
    private _formularioId: number;
    private _titulo: string;
    private _descricao?: string;
    private _modeloPadrao: boolean;
    private _ativo: boolean;
    private _dataCriacao: Date;
    private _perguntas: Pergunta[] = [];
    private _modeloBaseId?: number;

    public get formularioId(): number {
        return this._formularioId;
    }

    private set formularioId(value: number) {
        this._formularioId = value;
    } 

    get titulo(): string {
        return this._titulo;
    }

    private set titulo(value: string) {
        if (!value) {
        throw new Error('O título do formulário é obrigatório.');
        }
        this._titulo = value;
    }

    get descricao(): string | undefined {
        return this._descricao;
    }

    private set descricao(value: string | undefined) {
        this._descricao = value;
    }

    get modeloPadrao(): boolean {
        return this._modeloPadrao;
    }

    private set modeloPadrao(value: boolean) {
        this._modeloPadrao = value;
    }

    get ativo(): boolean {
        return this._ativo;
    }

    private set ativo(value: boolean) {
        this._ativo = value;
    }

    get dataCriacao(): Date {
        return this._dataCriacao;
    }
    // Não faz sentido ter um setter para data de criação, geralmente é imutável

    get perguntas(): Pergunta[] | undefined  {
        return this._perguntas.length > 0 ? this._perguntas : undefined;
    }

   private set perguntas(value: Pergunta[] | undefined ) {
        this._perguntas = value ?? [];
    }
    // Não implementamos um setter direto para perguntas, use os métodos de manipulação

    get modeloBaseId(): number | undefined {
        return this._modeloBaseId;
    }
    
    private set modeloBaseId(value: number | undefined) {
        this._modeloBaseId = value;
    }


     constructor(formulario: IFormulario) {
        this.formularioId = formulario.formularioId ?? Date.now();
        this.titulo = formulario.titulo;
        this.descricao = formulario.descricao;
        this.modeloPadrao = formulario.modeloPadrao;
        this.ativo = formulario.ativo ?? true;
        this._dataCriacao = formulario.dataCriacao ?? new Date();
        this.perguntas = formulario.perguntas;
        this.modeloBaseId = formulario.modeloBaseId;
      }
    
    
      adicionarPergunta(pergunta: Pergunta): void {
        const novaPergunta = new Pergunta({
            id: pergunta.id, 
            texto: pergunta.texto,
            tipo: pergunta.tipo,
            opcoes: pergunta.opcoes,
            ordem: pergunta.ordem
        });
        this._perguntas.push(novaPergunta);
      }

    removerPergunta(perguntaId: string): void {
        this._perguntas = this._perguntas.filter((p) => p.id !== perguntaId);
    }

    // Criar o método de adicionar o formulário agora no feedback.
}


export {Formulario}