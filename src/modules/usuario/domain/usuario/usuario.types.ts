import { Pessoa } from "@shared/domain/pessoa.entity";

enum Tipo {
    Funcionario,
    Administrador
}


interface IUsuario{
    id?: string;
    nome: string;
    email: string;
    pessoa: Pessoa;
    usuario: string;
    senha: string;
    tipo: Tipo;
}

type IUsuarioProps = Omit<IUsuario, 'id'>

type IRecuperarUsuarioProps =  Required<IUsuario>;

export{
    Tipo,
    IUsuario, 
    IUsuarioProps, 
    IRecuperarUsuarioProps
}