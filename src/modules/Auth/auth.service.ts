import { prisma } from "../../lib/prisma";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const secret = process.env.JWT_SECRET as string;

const registerUser = async (payload: any) => {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const result = await prisma.user.create({
        data: {...payload, password: hashPassword},
    });
    const { password, ...newResult } = result;
    return newResult;
}

const userLogin = async (payload: any) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });
    if (!user) {
        throw new Error("User not found")
    }

    const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid password")
    }

    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status

    }
    const token = jwt.sign(userData, secret, { expiresIn: "1d" });
    return {
        token,
        user
    }
}

export const AuthService = {
    // Add service methods here
    registerUser,
    userLogin
    };