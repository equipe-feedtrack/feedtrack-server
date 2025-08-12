import { IDatasControle } from "@shared/domain/data.types";


//Todos os atributos/propriedades que um produto deve ter no sistema
//Auxilia na criação de invariantes e modelos ricos
interface IProduto extends IDatasControle {
    id: string;
    nome: string;
    descricao: string;
    valor: number;
    ativo: boolean;

}

//Atributos que são necessários para criar um produto 
//Tipo representa um dos estados do ciclo de vida da entidade
//Garantir a integridade dos dados de um objeto
type CriarProdutoProps = Omit<IProduto, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>;

//Atributos que são necessários para recuperar um produto
//Tipo representa um dos estados do ciclo de vida da entidade
type RecuperarProdutoProps = IProduto;

export {
    IProduto,
    CriarProdutoProps,
    RecuperarProdutoProps
}