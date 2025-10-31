import { NextFunction, Request, RequestHandler, Response } from "express";
declare const handleAsyncRequest: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default handleAsyncRequest;
//# sourceMappingURL=handleAsyncRequest.d.ts.map