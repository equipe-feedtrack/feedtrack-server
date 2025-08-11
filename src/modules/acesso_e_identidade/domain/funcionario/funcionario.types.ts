// src/modules/acesso_e_identidade/domain/funcionario/funcionario.types.ts

import { IDatasControle, KeysDatasControle } from "@shared/domain/data.types";
import { Pessoa} from "@shared/domain/pessoa.entity"; // A entidade Pessoa
import { StatusUsuario } from "../usuario/usuario.types"; // Reutiliza o StatusUsuario

export interface IFuncionario extends IDatasControle { // Herda as datas de controle
  id: string; // ID é obrigatório para uma entidade
  
  usuarioId: string; // FK para Usuario (obrigatório, pois um funcionário SEMPRE é um usuário)
  cargo: string;
  dataAdmissao: Date; // Renomeado para dataAdmissao (camelCase)
  status: StatusUsuario; // Reutiliza o status de usuário
}

type CriarFuncionarioProps = Omit<IFuncionario, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao' | 'pessoa' | 'status'> & {
  pessoa: Omit<Pessoa, 'id'>; // Recebe as props da pessoa sem o ID dela
};

type RecuperarFuncionarioProps = IFuncionario;

export { 
    StatusUsuario,
    CriarFuncionarioProps,
    RecuperarFuncionarioProps
 }; // Reexporta StatusUsuario se for usado externamente aqui