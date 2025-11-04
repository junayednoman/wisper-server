import z from "zod";
export declare const verifyOtpZod: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
    verifyAccount: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type TVerifyOtpInput = z.infer<typeof verifyOtpZod>;
export declare const loginZodSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    fcmToken: z.ZodOptional<z.ZodString>;
    isMobileApp: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type TLoginInput = z.infer<typeof loginZodSchema>;
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