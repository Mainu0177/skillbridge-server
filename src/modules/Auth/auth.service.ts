import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import { prisma } from "../../lib/prisma";
import { RegisterPayload } from "./types";
import { Role, Status } from "../../../generated/prisma/enums";

const JWT_SECRET = process.env.JWT_SECRET!

const registerUser = async (payload: RegisterPayload) => {
    const { name, email, password, role } = payload;

    //* check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email already registered");

    //* Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    //* Assign role safely
    let userRole: Role = Role.STUDENT;
    if (role && role.toUpperCase() === "TUTOR") userRole = Role.TUTOR;

    //* Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: userRole,
            status: Status.ACTIVE,
            emailVerified: false
        },
    });
    //* Sign JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return {user, token}
}

export const authServices = {
    registerUser,
}