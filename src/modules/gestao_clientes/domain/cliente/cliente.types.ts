import { IDatasControle, KeysDatasControle } from "@shared/domain/data.types";
import {Pessoa, PessoaProps } from "@shared/domain/pessoa.entity";
import { IProduto } from "@modules/produtos/domain/produtos/produto.types";

enum StatusCliente {

  ATIVO = "ATIVO",
  INATIVO = "INATIVO",

}

interface ICliente extends IDatasControle {
  id?: string;
  pessoa: Pessoa;
  cidade?: string;
  vendedorResponsavel: string;
  status?: StatusCliente;
  produtos: Array<IProduto>;
}

interface ClienteEssencial {
  nome: string;
  email?: string;
  telefone?: string;
  produtos: Array<IProduto>;
  vendedorResponsavel: string;
}


// Tipo para criação de Cliente (sem id, dataCadastro e ativo — são automáticos)
type CriarClienteProps = Omit<ICliente, "id" | KeysDatasControle | "status">;

//Atributos que são necessários para recuperar um cliente
//Tipo representa um dos estados do ciclo de vida da entidade
type RecuperarClienteProps = ICliente & {
    id: NonNullable<ICliente['id']>
};


export { ICliente, CriarClienteProps, RecuperarClienteProps, StatusCliente, ClienteEssencial };
