"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (query, queryKeys) => {
    const finalObj = {};
    for (const key of queryKeys) {
        if (query && query[key]) {
            finalObj[key] = query[key];
        }
    }
    return finalObj;
};
exports.default = pick;
//# sourceMappingURL=pick.js.map