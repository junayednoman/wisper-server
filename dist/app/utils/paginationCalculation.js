"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePagination = void 0;
const calculatePagination = ({ page = 1, limit = 10, sortBy, orderBy, }) => {
    const take = Number(limit);
    const skip = Number(page - 1) * take;
    return {
        page: Number(page),
        skip,
        take,
        sortBy,
        orderBy,
    };
};
exports.calculatePagination = calculatePagination;
//# sourceMappingURL=paginationCalculation.js.map