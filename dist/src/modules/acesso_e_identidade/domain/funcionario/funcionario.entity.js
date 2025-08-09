"use strict";
// src/modules/acesso_e_identidade/domain/funcionario/funcionario.entity.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcionario = exports.FuncionarioExceptions = void 0;
const entity_1 = require("@shared/domain/entity");
const pessoa_entity_1 = require("@shared/domain/pessoa.entity"); // Entidade Pessoa
const crypto_1 = require("crypto"); // Para gerar IDs
const usuario_types_1 = require("../usuario/usuario.types"); // O enum StatusUsuario
// Exceções para Funcionario (crie um arquivo funcionario.exception.ts se necessário)
var FuncionarioExceptions;
(function (FuncionarioExceptions) {
    class CargoObrigatorioException extends Error {
        constructor() { super("Cargo do funcionário é obrigatório."); this.name = "CargoObrigatorioException"; }
    }
    FuncionarioExceptions.CargoObrigatorioException = CargoObrigatorioException;
    class DataAdmissaoInvalidaException extends Error {
        constructor() { super("Data de admissão não pode ser futura."); this.name = "DataAdmissaoInvalidaException"; }
    }
    FuncionarioExceptions.DataAdmissaoInvalidaException = DataAdmissaoInvalidaException;
    class FuncionarioJaInativoException extends Error {
        constructor() { super("Funcionário já está inativo."); this.name = "FuncionarioJaInativoException"; }
    }
    FuncionarioExceptions.FuncionarioJaInativoException = FuncionarioJaInativoException;
})(FuncionarioExceptions || (exports.FuncionarioExceptions = FuncionarioExceptions = {}));
class Funcionario extends entity_1.Entity {
    // Getters
    get pessoa() { return this._pessoa; }
    get usuarioId() { return this._usuarioId; }
    get cargo() { return this._cargo; }
    get dataAdmissao() { return this._dataAdmissao; }
    get status() { return this._status; }
    get dataCriacao() { return this._dataCriacao; }
    get dataAtualizacao() { return this._dataAtualizacao; }
    get dataExclusao() { return this._dataExclusao; }
    // Setters privados (com validações)
    set pessoa(pessoa) {
        if (!pessoa || !pessoa.nome || pessoa.nome.trim() === '') {
            throw new Error("Dados da pessoa (nome) são obrigatórios para o funcionário."); // Exceção específica
        }
        // Adicione mais validações de Pessoa aqui se necessário (ex: Pessoa deve ter email/telefone para Funcionario)
        this._pessoa = pessoa;
    }
    set usuarioId(id) {
        if (!id || id.trim() === '') {
            throw new Error("ID de usuário é obrigatório para o funcionário.");
        }
        this._usuarioId = id;
    }
    set cargo(value) {
        if (!value || value.trim() === '') {
            throw new FuncionarioExceptions.CargoObrigatorioException();
        }
        this._cargo = value.trim();
    }
    set dataAdmissao(value) {
        if (value.getTime() > new Date().getTime()) {
            throw new FuncionarioExceptions.DataAdmissaoInvalidaException();
        }
        this._dataAdmissao = value;
    }
    set status(value) { this._status = value; }
    set dataCriacao(value) { this._dataCriacao = value; }
    set dataAtualizacao(value) { this._dataAtualizacao = value; }
    set dataExclusao(value) { this._dataExclusao = value; }
    constructor(funcionario) {
        super(funcionario.id);
        this.pessoa = funcionario.pessoa;
        this.usuarioId = funcionario.usuarioId;
        this.cargo = funcionario.cargo;
        this.dataAdmissao = funcionario.dataAdmissao;
        this.status = funcionario.status;
        this.dataCriacao = funcionario.dataCriacao;
        this.dataAtualizacao = funcionario.dataAtualizacao;
        this.dataExclusao = funcionario.dataExclusao ?? null;
        this.validarInvariantes();
    }
    validarInvariantes() {
        // Ex: Data de admissão não pode ser muito antiga (regra de negócio)
        // Ex: Validação de cargo específico
    }
    // Métodos de Fábrica (Static Factory Methods)
    static criarFuncionario(props, id) {
        // Validações essenciais antes de construir o objeto completo
        if (!props.pessoa || !props.pessoa.nome || props.pessoa.nome.trim() === '') {
            throw new Error("Nome da pessoa é obrigatório para criar funcionário.");
        }
        if (!props.usuarioId || props.usuarioId.trim() === '') {
            throw new Error("ID de usuário é obrigatório para criar funcionário.");
        }
        if (!props.cargo || props.cargo.trim() === '') {
            throw new FuncionarioExceptions.CargoObrigatorioException();
        }
        if (props.dataAdmissao.getTime() > new Date().getTime()) {
            throw new FuncionarioExceptions.DataAdmissaoInvalidaException();
        }
        const funcionarioCompleto = {
            id: id || (0, crypto_1.randomUUID)(), // ID é gerado aqui se não for fornecido
            pessoa: pessoa_entity_1.Pessoa.criar(props.pessoa), // Cria uma entidade Pessoa
            usuarioId: props.usuarioId,
            cargo: props.cargo,
            dataAdmissao: props.dataAdmissao,
            status: usuario_types_1.StatusUsuario.ATIVO,
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        return new Funcionario(funcionarioCompleto);
    }
    static recuperar(props) {
        // O Prisma/Mapper deve garantir que todos os campos de IFuncionario estejam presentes e válidos
        if (!props.id || !props.pessoa || !props.usuarioId || !props.cargo || !props.dataAdmissao || !props.status || !props.dataCriacao || !props.dataAtualizacao) {
            throw new Error("Dados incompletos para recuperar Funcionário."); // Exceção de recuperação
        }
        // Adicione mais validações ao recuperar se o construtor for mais flexível
        return new Funcionario(props);
    }
    // --- Métodos de Comportamento da Entidade ---
    alterarCargo(novoCargo) {
        if (this.cargo === novoCargo) {
            throw new Error("Funcionário já possui este cargo.");
        }
        this.cargo = novoCargo; // Usa setter para validar
        this.dataAtualizacao = new Date();
    }
    ativar() {
        if (this.status === usuario_types_1.StatusUsuario.ATIVO) {
            throw new Error("Funcionário já está ativo.");
        }
        this.status = usuario_types_1.StatusUsuario.ATIVO;
        this.dataAtualizacao = new Date();
    }
    inativar() {
        if (this.status === usuario_types_1.StatusUsuario.INATIVO) {
            throw new FuncionarioExceptions.FuncionarioJaInativoException();
        }
        this.status = usuario_types_1.StatusUsuario.INATIVO;
        this.dataExclusao = new Date(); // Marca a data de inativação/exclusão lógica
        this.dataAtualizacao = new Date();
    }
    // Método para atualizar a data de admissão (ex: correção de erro, sem validação futura)
    corrigirDataAdmissao(novaData) {
        if (novaData.getTime() > new Date().getTime()) {
            throw new FuncionarioExceptions.DataAdmissaoInvalidaException(); // Revalida
        }
        this.dataAdmissao = novaData;
        this.dataAtualizacao = new Date();
    }
}
exports.Funcionario = Funcionario;
//# sourceMappingURL=funcionario.entity.js.map