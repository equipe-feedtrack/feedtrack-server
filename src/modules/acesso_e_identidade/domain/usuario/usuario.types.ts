import { IDatasControle } from "@shared/domain/data.types";
import { Pessoa } from "@shared/domain/pessoa.entity";
import { PessoaProps } from "@shared/domain/pessoa.types";

export enum TipoUsuario { // Renomeado de 'Tipo' para clareza
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum StatusUsuario { // Renomeado de 'Status_usuarios' para o domínio
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

// Interface IUsuario (Representa a entidade completa)
export interface IUsuario extends IDatasControle {
  id: string; // ID é obrigatório para uma entidade
  nomeUsuario: string; // Renomeado de 'usuario' para evitar conflito com a própria classe
  senhaHash: string; // Armazena o hash da senha
  tipo: TipoUsuario; // Tipo de usuário (role)
  status: StatusUsuario; // Status do usuário (ativo/inativo)
}

// IUsuarioProps: O que se passa para criar (sem ID e datas, que são gerados)
export type CriarUsuarioProps = Omit<IUsuario, 'usuarioId' | 'status' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>

export type RecuperarUsuarioProps = IUsuario;

