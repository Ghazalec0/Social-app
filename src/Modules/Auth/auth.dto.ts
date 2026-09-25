// auth.dto.ts
import z from "zod";
import { signupSchema as SignupSchema, loginSchema as LoginSchema } from "./auth.validation";

export type SignupDTO = z.infer<typeof SignupSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;

export interface VerifyAccountDTO {
    otp: string;
    email: string;
}

export interface ResetPasswordDTO {
    newPassword: string;
    otp: string;
    email: string;
}

export interface SendOTPDTO {
    email: string;
}