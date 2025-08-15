import { IDatasControle } from "@shared/domain/data.types";

enum StatusCliente {

  ATIVO = "ATIVO",
  INATIVO = "INATIVO",

}

interface ICliente extends IDatasControle {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  cidade: string | null;
  status: StatusCliente;
  empresaId: string;
}

interface ClienteEssencial {
  nome: string;
  email: string | null;
  telefone: string;
}


// Tipo para criação de Cliente (sem id, dataCadastro e ativo — são automáticos)
type CriarClienteProps = Omit<ICliente, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao' | 'status'>;

//Atributos que são necessários para recuperar um cliente
//Tipo representa um dos estados do ciclo de vida da entidade
type RecuperarClienteProps = ICliente;


export { ClienteEssencial, CriarClienteProps, ICliente, RecuperarClienteProps, StatusCliente };