import { Request, Response } from "express";
import { TutorService } from "./tutor.service";
import sendRepose from "../../utils/sendResponse";

const createTutors = async (req: Request, res: Response) => {
    try {
        const result = await TutorService.createTutor(req.body);
        sendRepose(res, {
            statusCode: 201,
            success: true,
            message: "Tutor create successfully",
            data: result
        });
    } catch (error) {
        sendRepose(res, {
            statusCode: 500,
            success: false,
            message: "Something went wrong!!",
            data: error
        })
    }
};

export const TutorController = {
    createTutors,
};
