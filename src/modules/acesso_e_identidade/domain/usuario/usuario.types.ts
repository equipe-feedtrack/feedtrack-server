import { IDatasControle } from "@shared/domain/data.types";

export enum TipoUsuario {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface IUsuario extends IDatasControle {
  id: string;
  nomeUsuario: string;
  senhaHash: string;
  tipo: TipoUsuario;
  email: string | null;
  status: StatusUsuario;
  empresaId: string;
}

export type CriarUsuarioProps = Omit<IUsuario, 'id' | 'status' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>

export type RecuperarUsuarioProps = IUsuario;

