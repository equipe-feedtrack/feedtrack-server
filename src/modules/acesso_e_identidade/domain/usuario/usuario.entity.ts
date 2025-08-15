import { Entity } from "@shared/domain/entity"; // Sua classe base Entity
import { randomUUID } from "crypto"; // Para gerar IDs
import { CriarUsuarioProps, IUsuario, RecuperarUsuarioProps, StatusUsuario, TipoUsuario } from "./usuario.types";
import bcrypt from "bcrypt";


class Usuario extends Entity<IUsuario> implements IUsuario {
  private _nomeUsuario: string; // Renomeado para evitar conflito
  private _senhaHash: string; // Armazena o hash da senha
  private _tipo: TipoUsuario;
  private _status: StatusUsuario; // Status do usuário
  private _email: string | null; // Opcional, para usuários que possuem email
  private _empresaId: string;
  private _tokenRecuperacao?: string | null; // Opcional, para recuperação de senha
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;
  private _dataExclusao: Date | null;

  // Getters (apenas o que deve ser exposto)
  public get nomeUsuario(): string { return this._nomeUsuario; }
  public get senhaHash(): string { return this._senhaHash; }
  public get tipo(): TipoUsuario { return this._tipo; }
  public get email(): string | null { return this._email; } // Pode ser null se não houver email
  public get empresaId(): string { return this._empresaId; }
  public get status(): StatusUsuario { return this._status; }
  public get dataCriacao(): Date { return this._dataCriacao; }
  public get dataAtualizacao(): Date { return this._dataAtualizacao; }
  public get dataExclusao(): Date | null { return this._dataExclusao; }

  // Setters privados (com validações)
private set nomeUsuario(username: string) {
  if (!username || username.trim().length < 3) {
    throw new Error("Nome de usuário é obrigatório e deve ter pelo menos 3 caracteres.");
  }

  const nomeLimpo = username.trim().toLowerCase();

  // Regex só aceita letras minúsculas, números, underscore (_) e ponto (.)
  const regexValido = /^[a-z0-9_.]+$/;
  if (!regexValido.test(nomeLimpo)) {
    throw new Error("Nome de usuário deve conter apenas letras minúsculas, números, underscore (_) ou ponto (.)");
  }

  this._nomeUsuario = nomeLimpo;
}

  private set senhaHash(hash: string) {
    if (!hash || hash.trim() === '') {
      throw new Error("Senha é obrigatória."); // Exceção específica
    }
    // Adicione validações de complexidade de senha aqui (min 8 caracteres, etc.)
    this._senhaHash = hash;
  }

  private set email(email: string | null) {
  if (email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      throw new Error("Email inválido.");
    }
    this._email = email.trim();
  } else {
    this._email = null;
  }
}


  private set tipo(type: TipoUsuario) { this._tipo = type; }
  private set empresaId(empresaId: string) { this._empresaId = empresaId; }
  private set status(status: StatusUsuario) { this._status = status; }
  private set dataCriacao(date: Date) { this._dataCriacao = date; }
  private set dataAtualizacao(date: Date) { this._dataAtualizacao = date; }
  private set dataExclusao(date: Date | null) { this._dataExclusao = date; }


  private constructor(user: IUsuario) {
    super(user.id); // ID agora é obrigatório em IUsuario
    this.nomeUsuario = user.nomeUsuario; // Usa o setter para validar nome de usuário
    this.senhaHash = user.senhaHash; // Usa o setter para validar senha
    this.tipo = user.tipo; // Usa o setter para validar tipo
    this.email = user.email; // Pode ser null, então não usa setter
    this.empresaId = user.empresaId;
    this.status = user.status; // Usa o setter para validar status

    this.dataCriacao = user.dataCriacao;
    this.dataAtualizacao = user.dataAtualizacao;
    this.dataExclusao = user.dataExclusao ?? null;

    // Validações adicionais da entidade (ex: se nomeUsuario já existe no DB - isso é mais para repositório)
  }

  // Métodos de Fábrica (Static Factory Methods)
public static async criarUsuario(props: CriarUsuarioProps, id?: string): Promise<Usuario> {
  if (!props.nomeUsuario || props.nomeUsuario.trim() === '') {
    throw new Error("Nome de usuário é obrigatório.");
  }
  if (!props.senhaHash || props.senhaHash.trim() === '') {
    throw new Error("Senha é obrigatória.");
  }

  console.log('props recebidos:', props);


  // Gerar o hash da senha
  const saltRounds = 10; // Quanto maior, mais seguro (mas mais lento)
  const senhaHasheada = await bcrypt.hash(props.senhaHash, saltRounds);

  const usuarioCompleto: IUsuario = {
    id: id || randomUUID(),
    nomeUsuario: props.nomeUsuario,
    senhaHash: senhaHasheada,
    tipo: props.tipo,
    email: props.email || null, // Pode ser null se não houver email
    status: StatusUsuario.ATIVO,
    empresaId: props.empresaId,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    dataExclusao: null,
  };

  return new Usuario(usuarioCompleto);
}

  toJSON(): IUsuario {
    return {
      id: this.id,
      nomeUsuario: this.nomeUsuario,
      senhaHash: this.senhaHash,
      tipo: this.tipo,
      email: this.email,
      status: this.status,
      empresaId: this.empresaId,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      dataExclusao: this.dataExclusao,
    };
  }


  public static recuperar(props: RecuperarUsuarioProps): Usuario {
    // O Prisma/Mapper deve garantir que todos os campos de IUsuario estejam presentes
    if (!props.id || !props.nomeUsuario || !props.senhaHash || !props.tipo || !props.status || !props.dataCriacao || !props.dataAtualizacao || !props.empresaId) {
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