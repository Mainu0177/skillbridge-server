import express, { Router } from 'express';

import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router:Router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("me",);
router.post("/login",);

//* For Student, User and Tutor both can use it
router.put("/changePassword");
router.delete("deleteAccount");

export const AuthRoutes = router;
