import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth";
import { tutorControllers } from "./tutor.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { tutorSchemas } from "./tutor.schema";

const router: Router = Router();

const tutorsRouterPublic: Router = Router();

router.post(
  "/profile",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  validateRequest(tutorSchemas.createTutorProfileSchema),
  tutorControllers.createProfile,
);
router.put(
  "/profile",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.updateProfile,
);
router.get(
  "/sessions",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getTutorSessions,
);
router.get(
  "/dashboard-data/:tutorId",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getTutorDashboard,
);

//* mark session complete
router.put(
  "/sessions/:sessionId/finish-session",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.markedSessionFinishController,
);

//* add availability slot
router.put(
  "/availability",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  validateRequest(tutorSchemas.addAvailabilitySchema),
  tutorControllers.addAvailabilityController,
);
router.get(
  "/availability",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getAllAvailabilities,
);
router.get(
  "/get-dashboard-data",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getTutorDashboard,
);

router.delete(
  "/availability/:id",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.deleteAvailability,
);

//* public routes
tutorsRouterPublic.get("/", tutorControllers.gettingAllTutorsLists); // Get all tutors with filters
tutorsRouterPublic.get("/:id", tutorControllers.getTutorProfileDetails); // Get tutor details

export const TutorRoutes = router;
export { tutorsRouterPublic };
