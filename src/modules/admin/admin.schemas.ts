import z from "zod";

const createCategorySchema = z.object({
    body: z.object({
        name: z
        .string({
            required_error: "Category name is required",
        }),

        subjects: z
        .array(z.string())
        .min(1, 'Subjects array must contain at least 1 items')
    }),
});


export const adminSchemas = {createCategorySchema}