import z from "zod";

const changePasswordSchema = z.object({
    body:z.object({
        newPassword: z
        .string({
        required_error: "newPaaword is required",
        }),
        oldPassword: z
        .string({
        required_error: "Old is required",
    }),


    })
})

export const studentSchemas = {changePasswordSchema}