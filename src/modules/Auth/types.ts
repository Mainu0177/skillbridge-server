import { Role } from "../../../generated/prisma/enums";
import { TutorFilters } from "../tutor/types";


export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    role?: "STUDENT" | "TUTOR"; //* Optional, default = STUDENT
};

export type LoginPayload = {
    email: string;
    password: string;
};

export interface jwtPayload {
    userId: string;
    role: "STUDENT" | "TUTOR" | "ADMIN";
}

export interface CurrentUserResponse{
    id: string;
    name: string;
    email: string;
    profileAvatar: string;
    role: Role;
    status: string;
    tutorProfile?: TutorFilters //* Only present if role = TUTOR
}