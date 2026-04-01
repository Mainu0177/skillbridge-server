import { User } from "../../generated/prisma/client";


declare global {
    namespace Express {
        interface Request {
        user?: {
            userId:string;
            
            role:"STUDENT"|"TUTOR"|"ADMIN";
        } 
        }
    }
}
