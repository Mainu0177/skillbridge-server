import { Request, Response, NextFunction } from "express";

import { authServices } from "./auth.service";
import { sendSuccess } from "../../utils/sendResponse";
import { prisma } from "../../lib/prisma";

const registerUser = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      
      const { user, token } = await authServices.registerUser(req.body);

      res.status(201).json({
        message: "User registered successfully",
        user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authServices.loginUser(req.body);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
      res.status(200).json({
        message: "Login successful",
        user,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({
      message: "Logout successful",
  
  });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
}

//* Get current user
const meUser = async (req: Request, res: Response) => {
  try {
    const user = await authServices.getCurrentUser((req as any).user.userId);
    return sendSuccess(res,{
      data:user
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

const handleAvatarChange = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userid = req.user?.userId

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = req.file as Express.Multer.File & { path: string };


    await prisma.user.update({
      where:{
        id:userid!
      },
      data:{
        profileAvatar:result.path
      }
    })

    return sendSuccess(res,{
      message:"your Profile Avatar Upload successfully",
      data:{
        profileAvatar:result.path
      }
    })


  
    
  } catch (error) {
    next(error)
  }
}

export const AuthController = {
  // Add controller methods here
  registerUser,
  loginUser,
  logoutUser,
  meUser,
  handleAvatarChange
};
