import { Formulario } from "../domain/formulario/formulario.entity";
import { IFormulario, RecuperarFormularioProps } from "../domain/formulario/formulario.types";

class FormularioMap {

    public static toDTO(formulario: Formulario): IFormulario {
        return {
            id: formulario.id,
            titulo: formulario.titulo,
            descricao: formulario.descricao,
            perguntas: formulario.perguntas,
            cliente: formulario.cliente,
            ativo: formulario.ativo,
            dataCriacao: formulario.dataCriacao,
            dataAtualizacao: formulario.dataAtualizacao
        }
    }

    public static toDomain(formulario: RecuperarFormularioProps): Formulario {
        return Formulario.recuperar(formulario);
    }

}

export { FormularioMap };
