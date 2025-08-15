export interface LoginInputDTO {
  nomeUsuario: string;
  senha: string;
  
}

export interface LoginOutputDTO {
    id: string;
    nomeUsuario: string;
    email: string | null;
    tipo: string; // ou seu enum TipoUsuario
    empresaId: string;
}
