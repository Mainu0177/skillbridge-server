import { prisma } from "../../lib/prisma"


const createTutor = async (payload: any) => {
    const result = await prisma.tutor.create({
        data: {
            ...payload,
        }
    });
    return result;
}

export const TutorService = {
    createTutor
}