import { z } from "zod";
export declare const personSignupZod: z.ZodObject<{
    password: z.ZodString;
    person: z.ZodObject<{
        email: z.ZodString;
        name: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        industry: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type TPersonSignUp = z.infer<typeof personSignupZod>;
export declare const updatePersonProfileZod: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    industry: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TUpdatePersonProfile = z.infer<typeof updatePersonProfileZod>;
//# sourceMappingURL=person.validation.d.ts.map