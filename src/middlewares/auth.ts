import { NextFunction, Request, Response } from "express"


const auth = (...roles: any) => {
    // console.log(roles)
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Is token exists

            // verify token

            // is decode user exists

            // Is users status active
        } catch (error: any) {
            throw new Error(error)
        }
        next();
    }
}

export default auth;