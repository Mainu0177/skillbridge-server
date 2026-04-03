
import { Router } from "express";

import { studentController } from "./student.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth";

const router:Router = Router();

//* Only students can access these routes
router.get("/profile",authMiddleware,roleMiddleware(["STUDENT"]), studentController.getProfile);
router.put("/profile",authMiddleware,roleMiddleware(["STUDENT"]), studentController.updateProfile);
router.post("/profile/avatar-change",authMiddleware,roleMiddleware(["STUDENT"]), studentController.updateProfile);
router.get("/:id/dashboard/stats",authMiddleware,roleMiddleware(["STUDENT"]),studentController.getStudentDashboardStats);


export default router;
