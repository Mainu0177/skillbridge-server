import { Router } from "express";

import { reviewSchemas } from "./review.schema";
import { reviewControllers } from "./review.controller";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

const router:Router = Router();

router.post("/",authMiddleware,roleMiddleware(["STUDENT"]),validateRequest(reviewSchemas.createReviewSchema),reviewControllers.createReview)
// router.get("/:studentId",authMiddleware,roleMiddleware(["STUDENT"]),validateRequest(reviewSchemas.createReviewSchema),reviewControllers.createReview)
router.get("/:tutorId",authMiddleware,roleMiddleware(["TUTOR"]),reviewControllers.getAllReview)

export default router;
