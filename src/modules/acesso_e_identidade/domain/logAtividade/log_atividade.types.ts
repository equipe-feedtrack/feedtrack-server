import { TipoUsuario } from "@prisma/client";

// Enum para o tipo de ação realizada
export enum TipoAcao {
  CRIAR_USUARIO = 'CRIAR_USUARIO',
  ATUALIZAR_USUARIO = 'ATUALIZAR_USUARIO',
  INATIVAR_USUARIO = 'INATIVAR_USUARIO',
  ALTERAR_SENHA = 'ALTERAR_SENHA',
  CRIAR_CLIENTE = 'CRIAR_CLIENTE',
  ATUALIZAR_CLIENTE = 'ATUALIZAR_CLIENTE',
  DELETAR_CLIENTE = 'DELETAR_CLIENTE',
  CRIAR_CAMPANHA = 'CRIAR_CAMPANHA',
  ATUALIZAR_CAMPANHA = 'ATUALIZAR_CAMPANHA',
  DESATIVAR_CAMPANHA = 'DESATIVAR_CAMPANHA',
  INICIAR_ENVIO_CAMPANHA = 'INICIAR_ENVIO_CAMPANHA',
  // ... adicione mais tipos de ação conforme necessário
}

// Enum para o tipo de entidade alvo
export enum EntidadeAlvoTipo {
  USUARIO = 'USUARIO',
  CLIENTE = 'CLIENTE',
  CAMPANHA = 'CAMPANHA',
  FORMULARIO = 'FORMULARIO',
  PRODUTO = 'PRODUTO',
  ENVIO_FORMULARIO = 'ENVIO_FORMULARIO',
  // ... adicione mais tipos de entidade conforme necessário
}

// Interface ILogAtividade (Representa a entidade completa)
export interface ILogAtividade {
  id: string;
  usuarioId: string;
  nomeUsuario: string;
  tipoUsuario: TipoUsuario;
  acao: TipoAcao;
  entidadeAlvoId?: string | null; // Pode ser null se a ação não for sobre uma entidade específica
  entidadeAlvoTipo?: EntidadeAlvoTipo | null;
  detalhes?: string | null; // Detalhes em JSON string ou texto livre
  dataOcorrencia: Date;
}

// Tipo para criação de LogAtividade
export type CriarLogAtividadeProps = Omit<ILogAtividade, 'id' | 'dataOcorrencia'>;

// Tipo para recuperação de LogAtividade
export type RecuperarLogAtividadeProps = ILogAtividade;