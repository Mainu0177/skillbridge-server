import express from "express";

import { TutorController } from "./tutor.controller";
import auth from "../../middlewares/auth";

const router = express.Router()

router.post("/", auth("ADMIN"), TutorController.createTutors)

export const TutorRoutes = router;