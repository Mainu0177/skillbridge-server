import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { secret } from "../modules/Auth/auth.service";


const auth = (...roles: any) => {
    // console.log(roles)
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Is token exists
            const token = req.headers.authorization
            if (!token) {
                throw new Error("Token not found!!");
            }

            // verify token
            const decoded = jwt.verify(token, secret);
            console.log(decoded);
            next();
            // is decode user exists

            // Is users status active
        } catch (error: any) {
            throw new Error(error)
        }
        next();
    }
}

export default auth;