import { Produto } from "@modules/produtos/domain/produto.entity";
import { IDatasControle } from "@shared/domain/data.types";
import { Pessoa } from "@shared/domain/pessoa.entity";

enum StatusCliente {

  ATIVO = "ATIVO",
  INATIVO = "INATIVO",

}

interface ICliente extends IDatasControle {
  id: string;
  pessoa: Pessoa;
  cidade: string | null;
  vendedorResponsavel: string;
  status: StatusCliente;
  produtos: Array<Produto>;
}

interface ClienteEssencial {
  nome: string;
  email?: string;
  telefone: string;
  produtos: Array<Produto>;
  vendedorResponsavel: string;
}


// Tipo para criação de Cliente (sem id, dataCadastro e ativo — são automáticos)
type CriarClienteProps = Omit<ICliente, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao' | 'status'>;

//Atributos que são necessários para recuperar um cliente
//Tipo representa um dos estados do ciclo de vida da entidade
type RecuperarClienteProps = ICliente;


export { ClienteEssencial, CriarClienteProps, ICliente, RecuperarClienteProps, StatusCliente };

