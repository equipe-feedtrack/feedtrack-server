import { Entity } from "@shared/domain/entity"; // Sua classe base Entity
import { Pessoa } from "@shared/domain/pessoa.entity"; // Sua entidade Pessoa
import { randomUUID } from "crypto"; // Para gerar IDs
import { CriarUsuarioProps, IUsuario, RecuperarUsuarioProps, StatusUsuario, TipoUsuario } from "./usuario.types";

class Usuario extends Entity<IUsuario> implements IUsuario {
  private _pessoa: Pessoa;
  private _nomeUsuario: string; // Renomeado para evitar conflito
  private _senhaHash: string; // Armazena o hash da senha
  private _tipo: TipoUsuario;
  private _status: StatusUsuario; // Status do usuário
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  // Getters (apenas o que deve ser exposto)
  public get pessoa(): Pessoa { return this._pessoa; }
  public get nomeUsuario(): string { return this._nomeUsuario; }
  public get senhaHash(): string { return this._senhaHash; }
  public get tipo(): TipoUsuario { return this._tipo; }
  public get status(): StatusUsuario { return this._status; }
  public get dataCriacao(): Date { return this._dataCriacao; }
  public get dataAtualizacao(): Date { return this._dataAtualizacao; }
  public get dataExclusao(): Date | null { return this._dataExclusao; }

  // Setters privados (com validações)
  private set pessoa(pessoa: Pessoa) {
    // Validações essenciais para Pessoa (ex: nome, email, telefone obrigatórios)
    if (!pessoa || !pessoa.nome || pessoa.nome.trim() === '') {
      throw new Error("Nome da pessoa é obrigatório para o usuário."); // Exceção específica
    }
    // Assumindo que a entidade Pessoa já valida telefone, email.
    this._pessoa = pessoa;
  }
  private set nomeUsuario(username: string) {
    if (!username || username.trim() === '') {
      throw new Error("Nome de usuário é obrigatório."); // Exceção específica
    }
    // Adicione validações de formato/unicidade para o nome de usuário (ex: min 3 caracteres)
    this._nomeUsuario = username.trim();
  }
  private set senhaHash(hash: string) {
    if (!hash || hash.trim() === '') {
      throw new Error("Senha é obrigatória."); // Exceção específica
    }
    // Adicione validações de complexidade de senha aqui (min 8 caracteres, etc.)
    this._senhaHash = hash;
  }
  private set tipo(type: TipoUsuario) { this._tipo = type; }
  private set status(status: StatusUsuario) { this._status = status; }
  private set dataCriacao(date: Date) { this._dataCriacao = date; }
  private set dataAtualizacao(date: Date) { this._dataAtualizacao = date; }
  private set dataExclusao(date: Date | null) { this._dataExclusao = date; }


  private constructor(user: IUsuario) {
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
  public static criarUsuario(props: CriarUsuarioProps, id?: string): Usuario {
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

    const usuarioCompleto: IUsuario = {
      id: id || randomUUID(), // ID é gerado aqui se não for fornecido
      pessoa: Pessoa.criar(props.pessoa), // Cria uma entidade Pessoa aqui
      nomeUsuario: props.nomeUsuario,
      senhaHash: senhaHasheada,
      tipo: props.tipo,
      status: StatusUsuario.ATIVO, // Usuário é ATIVO por padrão ao ser criado
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
      dataExclusao: null,
    };
    return new Usuario(usuarioCompleto);
  }

  public static recuperar(props: RecuperarUsuarioProps): Usuario {
    // O Prisma/Mapper deve garantir que todos os campos de IUsuario estejam presentes
    if (!props.id || !props.pessoa || !props.nomeUsuario || !props.senhaHash || !props.tipo || !props.status || !props.dataCriacao || !props.dataAtualizacao) {
      throw new Error("Dados incompletos para recuperar Usuário."); // Exceção de recuperação
    }
    return new Usuario(props);
  }

  // --- Métodos de Comportamento da Entidade ---
  public alterarSenha(novaSenha: string): void {
    if (!novaSenha || novaSenha.trim() === '') {
      throw new Error("Nova senha não pode ser vazia.");
    }
    // TODO: Integrar com serviço de hash de senha
    this.senhaHash = novaSenha; // Hash da nova senha
    this.dataAtualizacao = new Date();
  }

  public ativar(): void {
    if (this.status === StatusUsuario.ATIVO) {
      throw new Error("Usuário já está ativo.");
    }
    this.status = StatusUsuario.ATIVO;
    this.dataAtualizacao = new Date();
  }

  public inativar(): void {
    if (this.status === StatusUsuario.INATIVO) {
      throw new Error("Usuário já está inativo.");
    }
    this.status = StatusUsuario.INATIVO;
    this.dataExclusao = new Date(); // Marca a data de inativação/exclusão lógica
    this.dataAtualizacao = new Date();
  }

  public alterarTipo(novoTipo: TipoUsuario): void {
    if (this.tipo === novoTipo) {
      throw new Error("Usuário já possui este tipo.");
    }
    this.tipo = novoTipo;
    this.dataAtualizacao = new Date();
  }

  // Método para verificar a senha (aqui só para exemplo, autenticação é um Serviço de Domínio)
  public verificarSenha(senha: string): boolean {
    // TODO: Integrar com bcrypt.compare()
    return this.senhaHash === senha; // Comparação direta APENAS para exemplo
  }

  // Método para recuperar informações de auditoria (para o LogAtividade)
  public get infoAuditoria(): { usuarioId: string; tipoUsuario: TipoUsuario; nomeUsuario: string } {
    return {
      usuarioId: this.id,
      tipoUsuario: this.tipo,
      nomeUsuario: this.nomeUsuario,
    };
  }
}

export { Usuario };