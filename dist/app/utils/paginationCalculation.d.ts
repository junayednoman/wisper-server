export type TOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    orderBy?: "asc" | "desc";
};
export type TReturnOptions = {
    page: number;
    skip: number;
    take: number;
    sortBy?: string;
    orderBy?: "asc" | "desc";
};
export declare const calculatePagination: ({ page, limit, sortBy, orderBy, }: TOptions) => TReturnOptions;
//# sourceMappingURL=paginationCalculation.d.ts.map