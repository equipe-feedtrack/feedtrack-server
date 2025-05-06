class Cliente {
    id_cliente: number;            
    nome: string;                  
    telefone?: string;           
    email: string;                
    data_cadastro: Date;          
    preferencias?: string | Record<string, any>; 
  
    constructor(
      id_cliente: number,
      nome: string,
      email: string,
      data_cadastro: Date,
      telefone?: string,
      preferencias?: string | Record<string, any>
    ) {
      this.id_cliente = id_cliente;
      this.nome = nome;
      this.telefone = telefone;
      this.email = email;
      this.data_cadastro = data_cadastro;
      this.preferencias = preferencias;
    }
  }
  