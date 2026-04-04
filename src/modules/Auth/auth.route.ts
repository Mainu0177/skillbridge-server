

import { Router } from "express";

import { authSchemas } from "./auth.schema";
import { studentSchemas } from "../student/student.schema";
import { studentController } from "../student/student.controller";
// import { upload } from "../upload/upload-image.service"; 
import { upload } from "../upload/uploadImage.service"; 
import { validateRequest } from "../../middlewares/validateRequest";
import { authMiddleware, roleMiddleware } from "../../middlewares/auth";
import { AuthControllers } from "./auth.controller";


const router:Router = Router();

router.post("/register",validateRequest(authSchemas.registerUserSchema), AuthControllers.registerUser);
router.post("/login",validateRequest(authSchemas.loginSchema), AuthControllers.loginUser);
router.get("/me", authMiddleware, AuthControllers.meUser);
router.put("/profile/change-avatar",authMiddleware,roleMiddleware(["STUDENT","TUTOR"]),upload.single("file"), AuthControllers.handleAvatarChange);
router.post("/logout", authMiddleware, AuthControllers.logoutUser);

//* Student/User Tutor both car use it 
router.put("/change-password",authMiddleware,roleMiddleware(['STUDENT',"TUTOR"]), validateRequest(studentSchemas.changePasswordSchema), studentController.changePassword);
router.delete("/delete-account",authMiddleware,roleMiddleware(['STUDENT',"TUTOR"]), studentController.deleteAccount);
export const AuthRoutes =  router;
