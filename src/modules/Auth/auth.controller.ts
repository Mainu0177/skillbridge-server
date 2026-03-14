import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendRepose from "../../utils/sendResponse";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User Register successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "User Registered failed!",
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.userLogin(req.body);

    res.cookie("token", result.token, {
      secure: false,
      httpOnly: true,
      sameSite: "strict", // none, strict, lax
    });

    sendRepose(res, {
      statusCode: 201,
      success: true,
      message: "User login successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    sendRepose(res, {
      statusCode: 500,
      success: false,
      message: "User login failed",
      data: error,
    });
  }
};

export const AuthController = {
  // Add controller methods here
  registerUser,
  loginUser,
};
