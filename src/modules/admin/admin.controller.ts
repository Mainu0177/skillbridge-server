import { NextFunction, Request, Response } from "express";


import { sendSuccess } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";


const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await adminServices.getProfile(req.user!.userId);
        return sendSuccess(res, {
        statusCode: 200,
        message: "Profile fetched successfully",
        data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("main user",req.user);
        
        const users = await adminServices.getAllUsers();
        return sendSuccess(res, {
        statusCode: 200,
        message: "All users fetched successfully",
        data: users,
        });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        console.log(req.body);
        
        const user = await adminServices.updateUserStatus(req.params.id as string, status);
        return sendSuccess(res, {
        statusCode: 200,
        message: "User status updated successfully",
        data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await adminServices.getAllBookings();
        return sendSuccess(res, {
        statusCode: 200,
        message: "bookings fetch successfully",
        data: user,
        });
    } catch (error) {
        next(error);
    }
};

const createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newCategory = await adminServices.createCategory(req.body);
        return sendSuccess(res, {
        statusCode: 200,
        message: "bookings fetch successfully",
        data: newCategory,
        });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name,subjects} = req.body;
        const categoryId = req.params.categoryId
        const updatedCategory = await adminServices.updateCategory({
            name,subjects,categoryId:String(categoryId)
        });
        return sendSuccess(res, {
        statusCode: 200,
        message: "category updated successfully",
        data: updatedCategory,
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.categoryId
        const newCategory = await adminServices.deleteCategory(String(categoryId));
        return sendSuccess(res, {
        statusCode: 200,
        message: "category delete successfully",
        data: newCategory,
        });
    } catch (error) {
        next(error);
    }
};

const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await adminServices.getDashboardData();
        return sendSuccess(res, {
        statusCode: 200,
        message: "category delete successfully",
        data,
        });
    } catch (error) {
        next(error);
    }
};


export const adminControllers = {
    getProfile,
    getAllBookings,
    getAllUsers,
    updateUserStatus,
    createNewCategory,
    updateCategory,
    deleteCategory,
    getDashboardData
};