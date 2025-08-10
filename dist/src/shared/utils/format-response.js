"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponseKeys = formatResponseKeys;
function formatResponseKeys(data) {
    if (Array.isArray(data)) {
        return data.map(item => formatResponseKeys(item));
    }
    if (typeof data === 'object' && data !== null) {
        const newObject = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newObject[`_${key}`] = formatResponseKeys(data[key]);
            }
        }
        return newObject;
    }
    return data;
}
//# sourceMappingURL=format-response.js.map