import z from "zod";
import { SYS_GENDER } from "../enums";

export const generalFields = {
  email: z.email({ message: "Email is required" }),
  gender: z.enum(SYS_GENDER, { message: "Invalid gender" }).optional(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!?&])[A-Za-z\d@#$%!?&]{8,}$/,
    ),
  userName: z.string({ message: "username is required" }).min(2).max(20),
  phoneNumber: z.string().regex(/^(00201|\+201|01)[0125][0-9]{8}$/),
};