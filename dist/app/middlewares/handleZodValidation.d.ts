import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
declare const handleZodValidation: (schema: ZodObject, { formData }?: {
    formData?: boolean;
}) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export default handleZodValidation;
//# sourceMappingURL=handleZodValidation.d.ts.map