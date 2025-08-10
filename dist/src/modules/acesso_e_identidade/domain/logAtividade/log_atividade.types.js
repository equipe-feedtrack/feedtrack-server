"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntidadeAlvoTipo = exports.TipoAcao = void 0;
// Enum para o tipo de ação realizada
var TipoAcao;
(function (TipoAcao) {
    TipoAcao["CRIAR_USUARIO"] = "CRIAR_USUARIO";
    TipoAcao["ATUALIZAR_USUARIO"] = "ATUALIZAR_USUARIO";
    TipoAcao["INATIVAR_USUARIO"] = "INATIVAR_USUARIO";
    TipoAcao["ALTERAR_SENHA"] = "ALTERAR_SENHA";
    TipoAcao["CRIAR_CLIENTE"] = "CRIAR_CLIENTE";
    TipoAcao["ATUALIZAR_CLIENTE"] = "ATUALIZAR_CLIENTE";
    TipoAcao["DELETAR_CLIENTE"] = "DELETAR_CLIENTE";
    TipoAcao["CRIAR_CAMPANHA"] = "CRIAR_CAMPANHA";
    TipoAcao["ATUALIZAR_CAMPANHA"] = "ATUALIZAR_CAMPANHA";
    TipoAcao["DESATIVAR_CAMPANHA"] = "DESATIVAR_CAMPANHA";
    TipoAcao["INICIAR_ENVIO_CAMPANHA"] = "INICIAR_ENVIO_CAMPANHA";
    // ... adicione mais tipos de ação conforme necessário
})(TipoAcao || (exports.TipoAcao = TipoAcao = {}));
// Enum para o tipo de entidade alvo
var EntidadeAlvoTipo;
(function (EntidadeAlvoTipo) {
    EntidadeAlvoTipo["USUARIO"] = "USUARIO";
    EntidadeAlvoTipo["CLIENTE"] = "CLIENTE";
    EntidadeAlvoTipo["CAMPANHA"] = "CAMPANHA";
    EntidadeAlvoTipo["FORMULARIO"] = "FORMULARIO";
    EntidadeAlvoTipo["PRODUTO"] = "PRODUTO";
    EntidadeAlvoTipo["ENVIO_FORMULARIO"] = "ENVIO_FORMULARIO";
    // ... adicione mais tipos de entidade conforme necessário
})(EntidadeAlvoTipo || (exports.EntidadeAlvoTipo = EntidadeAlvoTipo = {}));
//# sourceMappingURL=log_atividade.types.js.map