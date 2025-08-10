"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const entity_1 = require("@shared/domain/entity"); // Sua classe base Entity
const pessoa_entity_1 = require("@shared/domain/pessoa.entity"); // Sua entidade Pessoa
const crypto_1 = require("crypto"); // Para gerar IDs
const usuario_types_1 = require("./usuario.types");
class Usuario extends entity_1.Entity {
    // Getters (apenas o que deve ser exposto)
    get pessoa() { return this._pessoa; }
    get nomeUsuario() { return this._nomeUsuario; }
    get senhaHash() { return this._senhaHash; }
    get tipo() { return this._tipo; }
    get status() { return this._status; }
    get dataCriacao() { return this._dataCriacao; }
    get dataAtualizacao() { return this._dataAtualizacao; }
    get dataExclusao() { return this._dataExclusao; }
    // Setters privados (com validações)
    set pessoa(pessoa) {
        // Validações essenciais para Pessoa (ex: nome, email, telefone obrigatórios)
        if (!pessoa || !pessoa.nome || pessoa.nome.trim() === '') {
            throw new Error("Nome da pessoa é obrigatório para o usuário."); // Exceção específica
        }
        // Assumindo que a entidade Pessoa já valida telefone, email.
        this._pessoa = pessoa;
    }
    set nomeUsuario(username) {
        if (!username || username.trim() === '') {
            throw new Error("Nome de usuário é obrigatório."); // Exceção específica
        }
        // Adicione validações de formato/unicidade para o nome de usuário (ex: min 3 caracteres)
        this._nomeUsuario = username.trim();
    }
    set senhaHash(hash) {
        if (!hash || hash.trim() === '') {
            throw new Error("Senha é obrigatória."); // Exceção específica
        }
        // Adicione validações de complexidade de senha aqui (min 8 caracteres, etc.)
        this._senhaHash = hash;
    }
    set tipo(type) { this._tipo = type; }
    set status(status) { this._status = status; }
    set dataCriacao(date) { this._dataCriacao = date; }
    set dataAtualizacao(date) { this._dataAtualizacao = date; }
    set dataExclusao(date) { this._dataExclusao = date; }
    constructor(user) {
        super(user.id); // ID agora é obrigatório em IUsuario
        this.pessoa = user.pessoa; // Usa o setter para validar Pessoa
        this.nomeUsuario = user.nomeUsuario; // Usa o setter para validar nome de usuário
        this.senhaHash = user.senhaHash; // Usa o setter para validar senha
        this.tipo = user.tipo; // Usa o setter para validar tipo
        this.status = user.status; // Usa o setter para validar status
        this.dataCriacao = user.dataCriacao;
        this.dataAtualizacao = user.dataAtualizacao;
        this.dataExclusao = user.dataExclusao ?? null;
        // Validações adicionais da entidade (ex: se nomeUsuario já existe no DB - isso é mais para repositório)
    }
    // Métodos de Fábrica (Static Factory Methods)
    static criarUsuario(props, id) {
        // Validações iniciais antes de construir o objeto completo
        if (!props.pessoa || !props.pessoa.nome || !props.pessoa.telefone) { // Telefone da pessoa é obrigatório para Cliente, mas para Usuário?
            throw new Error("Dados da pessoa (nome, telefone) são obrigatórios para o usuário."); // Exceção específica
        }
        if (!props.nomeUsuario || props.nomeUsuario.trim() === '') {
            throw new Error("Nome de usuário é obrigatório.");
        }
        if (!props.senhaHash || props.senhaHash.trim() === '') {
            throw new Error("Senha é obrigatória.");
        }
        // Hash da senha (idealmente feito por um serviço externo ou um Value Object Senha)
        // Para simplificar, faremos um hash básico aqui (mas não para produção!)
        const senhaHasheada = props.senhaHash; // TODO: Integrar com bcrypt ou similar
        const usuarioCompleto = {
            id: id || (0, crypto_1.randomUUID)(), // ID é gerado aqui se não for fornecido
            pessoa: pessoa_entity_1.Pessoa.criar(props.pessoa), // Cria uma entidade Pessoa aqui
            nomeUsuario: props.nomeUsuario,
            senhaHash: senhaHasheada,
            tipo: props.tipo,
            status: usuario_types_1.StatusUsuario.ATIVO, // Usuário é ATIVO por padrão ao ser criado
            dataCriacao: new Date(),
            dataAtualizacao: new Date(),
            dataExclusao: null,
        };
        return new Usuario(usuarioCompleto);
    }
    static recuperar(props) {
        // O Prisma/Mapper deve garantir que todos os campos de IUsuario estejam presentes
        if (!props.id || !props.pessoa || !props.nomeUsuario || !props.senhaHash || !props.tipo || !props.status || !props.dataCriacao || !props.dataAtualizacao) {
            throw new Error("Dados incompletos para recuperar Usuário."); // Exceção de recuperação
        }
        return new Usuario(props);
    }
    // --- Métodos de Comportamento da Entidade ---
    alterarSenha(novaSenha) {
        if (!novaSenha || novaSenha.trim() === '') {
            throw new Error("Nova senha não pode ser vazia.");
        }
        // TODO: Integrar com serviço de hash de senha
        this.senhaHash = novaSenha; // Hash da nova senha
        this.dataAtualizacao = new Date();
    }
    ativar() {
        if (this.status === usuario_types_1.StatusUsuario.ATIVO) {
            throw new Error("Usuário já está ativo.");
        }
        this.status = usuario_types_1.StatusUsuario.ATIVO;
        this.dataAtualizacao = new Date();
    }
    inativar() {
        if (this.status === usuario_types_1.StatusUsuario.INATIVO) {
            throw new Error("Usuário já está inativo.");
        }
        this.status = usuario_types_1.StatusUsuario.INATIVO;
        this.dataExclusao = new Date(); // Marca a data de inativação/exclusão lógica
        this.dataAtualizacao = new Date();
    }
    alterarTipo(novoTipo) {
        if (this.tipo === novoTipo) {
            throw new Error("Usuário já possui este tipo.");
        }
        this.tipo = novoTipo;
        this.dataAtualizacao = new Date();
    }
    // Método para verificar a senha (aqui só para exemplo, autenticação é um Serviço de Domínio)
    verificarSenha(senha) {
        // TODO: Integrar com bcrypt.compare()
        return this.senhaHash === senha; // Comparação direta APENAS para exemplo
    }
    // Método para recuperar informações de auditoria (para o LogAtividade)
    get infoAuditoria() {
        return {
            usuarioId: this.id,
            tipoUsuario: this.tipo,
            nomeUsuario: this.nomeUsuario,
        };
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=usuario.entity.js.map