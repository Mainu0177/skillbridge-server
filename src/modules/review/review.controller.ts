import { NextFunction, Request, Response } from "express";
import { sendSuccess } from "../../utils/sendResponse";
import { reviewsServices } from "./review.service";


const createReview = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const studentId = req.user?.userId!
        const newReview = await reviewsServices.createReview({...req.body,studentId});
        return sendSuccess(res,{
            statusCode:201,
            message:"your Review Created successfully",
            data:newReview
        })
    } catch (error) {
        next(error)   
    }
}
const getAllReview = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const tutorId = req.params.tutorId
        console.log("tutorId",tutorId);
        
        const allReviewByTutorId = await reviewsServices.getAllReview(tutorId as string);
        return sendSuccess(res,{
            statusCode:201,
            message:"your Review fetch successfully",
            data:allReviewByTutorId
        })
    } catch (error) {
        next(error)   
    }
}

export const reviewControllers = {createReview,getAllReview}