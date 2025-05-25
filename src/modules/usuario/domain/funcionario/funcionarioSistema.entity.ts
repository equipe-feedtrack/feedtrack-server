import { IFuncionarioSistema } from "./funcionarioSistema.types";
import { Usuario } from "@shared/domain/usuario.entity";

class FuncionarioSistema extends Usuario implements IFuncionarioSistema { // Funcionário pode herdar de Usuario, pois aqui é Funcionário que acessa o sistema!
    nome: string;
}

export {FuncionarioSistema}