import { startOfMonth, endOfMonth } from "date-fns";

import { prisma } from "../../lib/prisma";
import { Status } from "../../../generated/prisma/enums";

const getProfile = async (userId: string) => {
    return await prisma.user.findUnique({
        where: { id: userId }
    });
};

const getAllUsers = async () => {
    console.log("services");
    return await prisma.user.findMany({
        select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        },
        where:{
        role:{
        in: ["STUDENT", "TUTOR"],
        },

        },
        orderBy: { createdAt: "desc" },
    });
};
const getAllBookings = async () => {
    return await prisma.booking.findMany({
        include:{
            student:true,
            availability:true,
            review:true,
            tutor:{
            include:{
            user:{
                select:{
                name:true
                }
            }
            }
            }
        },
        orderBy: { createdAt: "desc" },
    });
};

const updateUserStatus = async (userId: string, status: Status) => {
    console.log(status);
    
    return await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, status: true },
    });
    };
    const createCategory = async (payload:{
    name:string,subjects:string[]
    }) => {

    const newCategory = await prisma.category.create({
        data:payload
    });

    return newCategory

};

const updateUserStatus = async (userId: string, status: Status) => {
    console.log(status);
    
    return await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, name: true, email: true, status: true },
    });
    };
    const createCategory = async (payload:{
    name:string,subjects:string[]
    }) => {

    const newCategory = await prisma.category.create({
        data:payload
    });

    return newCategory

};

export async function getDashboardData() {
    const [
        activeTutors,
        activeStudents,
        totalBookings,
        completedBookingsCount,
        completedBookings,
    ] = await Promise.all([
        // Active Tutors
        prisma.user.count({
        where: {
            role: "TUTOR",
            status: "ACTIVE",
            tutorProfile: {
            booking: {
                some: {
                status: {
                    in: ["CONFIRMED", "COMPLETED"],
                },
                },
            },
            },
        },
        }),

        // Active Students
        prisma.user.count({
        where: {
            role: "STUDENT",
            status: "ACTIVE",
            studentBookings: {
            some: {},
            },
        },
        }),

        // Total bookings
        prisma.booking.count(),

        // Completed bookings count
        prisma.booking.count({
        where: {
            status: "COMPLETED",
        },
        }),

        // Completed bookings with tutor rate (for revenue)
        prisma.booking.findMany({
        where: {
            status: "COMPLETED",
            createdAt: {
            gte: startOfMonth(new Date()),
            lte: endOfMonth(new Date()),
            },
        },
        select: {
            tutor: {
            select: {
                hourlyRate: true,
            },
            },
        },
        }),
    ]);

    const monthlyRevenue = completedBookings.reduce(
        (sum, booking) => sum + booking.tutor.hourlyRate,
        0
    );

    const bookingRate =
        totalBookings === 0
        ? 0
        : Number(
            ((completedBookingsCount / totalBookings) * 100).toFixed(2)
            );

    return {
        activeTutors,
        activeStudents,
        monthlyRevenue,
        bookingRate,
    };
}

export const adminServices = {
    getProfile,
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    createCategory,
    updateCategory,
    deleteCategory,
    getDashboardData
};