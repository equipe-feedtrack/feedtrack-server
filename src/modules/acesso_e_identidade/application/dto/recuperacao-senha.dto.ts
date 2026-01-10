export interface SolicitarRecuperacaoSenhaDTO {
  email: string;
}

export interface ConfirmarRecuperacaoSenhaDTO {
  token: string;
  novaSenha: string;
  confirmacaoNovaSenha: string;
}
