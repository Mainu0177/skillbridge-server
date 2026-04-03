import { z } from "zod";

const createReviewSchema = z.object({
    body:z.object({  bookingId: z.string().uuid("Invalid booking ID"),
    tutorId: z.string().uuid("Invalid tutor ID"),
    studentId: z.string().uuid("Invalid student ID"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    comment: z.string().min(2,"you must be provide a comment text"),}) })

export const reviewSchemas = {createReviewSchema}