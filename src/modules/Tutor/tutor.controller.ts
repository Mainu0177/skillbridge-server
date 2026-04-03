
import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";


//* Create Tutor profile
const createProfile =async (req: Request, res: Response) => {
    try {
    const userId = req.user?.userId!; // injected by authMiddleware
    const profile = await tutorServices.createTutorProfile(userId, req.body);
    res.status(201).json({ message: "Profile created successfully", profile });
    } catch (error: any) {
    res.status(400).json({ error: error.message });
    }
}

//* Tutor profile update
const updateProfile=async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId!;
        const profile = await tutorServices.updateTutorProfile(userId, req.body);
        res.status(200).json({ message: "Profile updated successfully", profile });
        } catch (error: any) {
        res.status(400).json({ error: error.message });
        }
    }

//* Tutor Profile
const getProfile = async (req: Request, res: Response) => {
    try {
    const userId = req.user?.userId!;
    const profile = await tutorServices.getTutorProfile(userId);
    res.status(200).json(profile);
    } catch (error: any) {
    res.status(400).json({ error: error.message });
    }
}

//* Tutor Delete availability
const getTutorSessions = async (req: Request, res: Response) => {
    try {
    const userId = req.user?.userId!;
    const sessions = await tutorServices.getTutorSessions(userId);
    res.status(200).json({
        message:"session fetch successfully",
        data:sessions
    });
    } catch (error: any) {
    res.status(400).json({ error: error.message });
    }
}

//* Tutor get availability
const getAvailability = async (req: Request, res: Response) => {
    try {
    const tutorUserId =req.user?.userId!;
    const result = await tutorServices.getAvailability(tutorUserId);

    res.status(200).json({
        success: true,
        data: result,
    });
        } catch (error: any) {
        res.status(400).json({ error: error.message });
        }
}

//* Tutor get all availability
const getAllAvailabilities = async (req: Request, res: Response) => {
    try {
    const tutorUserId =req.user?.userId!;
    const result = await tutorServices.getAllAvailability(tutorUserId);
    console.log(result);

    res.status(200).json({
        success: true,
        data: result,
    });
        } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

//* Tutor Add availability
const addAvailabilityController = async (req: Request, res: Response) => {
    try {
    const userId = req.user?.userId!;

    
    const updatedData = await tutorServices.addAvailabilityService(userId,req.body);
    res.status(200).json({
        message:"added availability successfully",
        data:updatedData
    });
    } catch (error: any) {
    res.status(400).json({ error: error.message });
    }
}
//* Tutor Delete availability
const deleteAvailability = async (req: Request, res: Response) => {
    try {
    const tutorUserId =req.user?.userId!;
    const availabilityId = req.params.id as string

    await tutorServices.deleteAvailability(tutorUserId, availabilityId);

    res.status(200).json({
        success: true,
        message: "Availability removed",
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        });
    }
}

//* Marked session
const markedSessionFinishController = async (req: Request, res: Response,next:NextFunction) => {
        try {
        const {tutorId,status} = req.body
        const sessionId = req.params.sessionId as string

        const updateSession = await tutorServices.markedSessionFinish(tutorId,sessionId,status);
        sendSuccess(res,{
            message:"session marked successfully",
            data:updateSession
        });
        } catch (error: any) {
        next(error)
    }
}

//* Get all tutors list
const gettingAllTutorsLists = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const filters = {
        category: req.query.category as string | undefined,
        q: req.query.q as string | undefined,
        maxPrice: req.query.maxPrice as string | undefined,
        minPrice: req.query.minPrice as string | undefined,
        rating: req.query.rating as string | undefined,
        subject: req.query.subject as string | undefined,
        };

        const allTutors = await tutorServices.getAllTutors(filters);

        return res.status(200).json({
        success: true,
        message: "Fetch tutors successfully",
        data: allTutors,
        });
    } catch (error) {
        next(error);
    }
}


//* Tutor profile details
const getTutorProfileDetails = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).params.id
        const sessions = await tutorServices.getTutorProfilePublic(userId);
        res.status(200).json({
            message:"tutor profile fetch successfully",
            data:sessions
        });
        } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}


const getTutorDashboard = async (req: Request, res: Response,next:NextFunction) => {
    try {

    const user = await prisma.user.findUnique({
        where:{id:req.user?.userId!},
        include:{tutorProfile:true}
    })

    if(!user){
        return sendError(res,{
            message:"User Not found"
        })
    }
    const tutorId = user.tutorProfile?.id; 

    //* Call to Service
    const dashboardData = await tutorServices.tutorDashboardData(tutorId as string);

    //* If Tutor profile not found
    if (!dashboardData.tutorData) {
        return res.status(404).json({
            success: false,
            message: "Tutor profile not found!",
        });
        }

        //* success response
        res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
            profile: {
            name: dashboardData.tutorData.user.name,
            totalSessions: dashboardData.totalSessions,
            avgRating: dashboardData.ratingData._avg.rating || 0,
            totalReviews: dashboardData.ratingData._count.id,
            },
            upcomingSessions: dashboardData.tutorData.bookings,
            availability: dashboardData.tutorData.availability,
            recentFeedback: dashboardData.recentReview ? {
            comment: dashboardData.recentReview.comment,
            studentName: dashboardData.recentReview.student.name,
            } : null
        }
        });

    } catch (error:any) {
        console.error("Dashboard Controller Error:", error);
        res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
        });
    }
};

export const tutorControllers = {
    createProfile,
    updateProfile,
    getProfile,
    getTutorSessions,
    addAvailabilityController,
    markedSessionFinishController,
    gettingAllTutorsLists,
    deleteAvailability,
    getAvailability,
    getTutorProfileDetails,
    getAllAvailabilities,
    getTutorDashboard,
}