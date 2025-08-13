export interface LoginInputDTO {
  nomeUsuario: string;
  senha: string;
}

export interface LoginOutputDTO {
  sucesso: boolean;
  usuario?: {
    id: string;
    nomeUsuario: string;
    email: string | null;
    tipo: string; // ou seu enum TipoUsuario
    nomeEmpresa: string | null
    // outros campos que quiser expor, mas **nunca** a senha
  };
}
