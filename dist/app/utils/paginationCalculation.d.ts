export type TPaginationOptions = {
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
export declare const calculatePagination: ({ page, limit, sortBy, orderBy, }: TPaginationOptions) => TReturnOptions;
//# sourceMappingURL=paginationCalculation.d.ts.map