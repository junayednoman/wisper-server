import { Response } from "express";
export type TResponse<T> = {
    status?: number;
    success?: boolean;
    message: string;
    data: T | null;
};
export declare const sendResponse: <T>(res: Response, { status, success, message, data }: TResponse<T>) => void;
//# sourceMappingURL=sendResponse.d.ts.map