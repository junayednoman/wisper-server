import z from "zod";
export declare const passwordZod: z.ZodString;
export declare const emailZod: z.ZodString;
export declare const phoneZod: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
//# sourceMappingURL=global.validation.d.ts.map