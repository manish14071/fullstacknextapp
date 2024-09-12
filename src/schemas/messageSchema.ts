import { z } from "zod"

export const messageSchema = z.object({
    content: z.string()
        .min(10, { message: "content atleast 10 character" })
        .max(300, { message: "content cant exceed 300 character" })

})