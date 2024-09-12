import { z } from "zod"
export const userNameValidation = z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(20, "username no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "username cant contain special characters")


    export const signUpSchema=z.object({
        username:userNameValidation,
        email:z.string().email({message:"Inavlid email address"}),
        password:z.string().min(6,{message:"password must be atlest 6 characters"})
    })