interface ICliente {
    id: string;                    
    nome: string;                  
    telefone: string;             
    email?: string;                
    cidade: string;
    vendedorResponsavel?: string; 
    dataCadastro: Date;           
  }
  
  // Tipo para criação de Cliente (sem o id e dataCadastro, pois são automáticos)
  type CriarClienteProps = Omit<ICliente, "id" | "dataCadastro">;
  
  export { ICliente, CriarClienteProps };