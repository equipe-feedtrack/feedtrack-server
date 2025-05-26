import {PessoaProps } from "@shared/domain/pessoa.entity";

interface IFuncionario {
    id?: string;
    pessoa: PessoaProps;
    cargo: string;
    dataAdimissao: Date;
    status: boolean;

};

type IFuncionarioProps = Omit<IFuncionario, "id">;

type IRecuperarFuncionarioProps = Required<IFuncionario>;

export {IFuncionario, IFuncionarioProps, IRecuperarFuncionarioProps}