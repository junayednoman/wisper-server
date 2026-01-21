import z from "zod";
export declare const loginZodSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fcmToken: z.ZodOptional<z.ZodString>;
    isMobileApp: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type TLoginInput = z.infer<typeof loginZodSchema>;
export declare const googleLoginSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    image: z.ZodString;
    fcmToken: z.ZodString;
    role: z.ZodEnum<{
        PERSON: "PERSON";
        BUSINESS: "BUSINESS";
    }>;
}, z.core.$strip>;
export type TGoogleLoginInput = z.infer<typeof googleLoginSchema>;
export declare const resetPasswordZod: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type TResetPasswordInput = z.infer<typeof resetPasswordZod>;
export declare const changePasswordZod: z.ZodObject<{
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type TChangePasswordInput = z.infer<typeof changePasswordZod>;
export declare const changeAccountStatusZod: z.ZodObject<{
    status: z.ZodPipe<z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        BLOCKED: "BLOCKED";
        DELETED: "DELETED";
    }>>, z.ZodTransform<string, "ACTIVE" | "BLOCKED" | "DELETED">>;
}, z.core.$strip>;
//# sourceMappingURL=auth.validation.d.ts.map