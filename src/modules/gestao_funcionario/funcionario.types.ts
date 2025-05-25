interface IFuncionario {
    id?: string;
    nome: string;
    email?: string;
    telefone: string;
    cargo: string;

};

type IFuncionarioProps = Omit<IFuncionario, "id">;

type IRecuperarFuncionarioProps = Required<IFuncionario>;

export {IFuncionario, IFuncionarioProps, IRecuperarFuncionarioProps}