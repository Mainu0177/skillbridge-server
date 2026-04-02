import { z } from "zod";

const bookingCreateSchema = z.object({
    body: z.object({
        tutorId: z
        .string({
            required_error: "Tutor ID is required",
        })
        .uuid("Invalid tutor ID"),
        availabilityId: z
        .string({
            required_error: "availabilityId  is required",
        })
        .uuid("Invalid availabilityId ")

    
    }),

});


export const bookingSchemas = {bookingCreateSchema}