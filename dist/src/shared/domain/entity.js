"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const crypto_1 = require("crypto");
const domain_exception_1 = require("./domain.exception");
//Método que verifica se é a instância de uma entidade
const isEntity = (v) => {
    return v instanceof Entity;
};
class Entity {
    ///////////////
    //Gets e Sets//
    ///////////////
    get id() {
        return this._id;
    }
    set id(value) {
        if (!Entity.validUUID(value)) {
            throw new domain_exception_1.IDEntityUUIDInvalid();
        }
        this._id = value;
    }
    //////////////
    //Construtor//
    //////////////
    constructor(id) {
        this.id = id ? id : (0, crypto_1.randomUUID)();
    }
    ///////////
    //Métodos//
    ///////////
    equals(object) {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        if (!isEntity(object)) {
            return false;
        }
        return this._id == object._id;
    }
    static validUUID(UUID) {
        let padraoUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return padraoUUID.test(UUID);
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map