import { Router } from "express";

import { sharedControllers } from "./shared.controller";

const router:Router = Router();

router.get("/categories", sharedControllers.getAllCategories);  //Get all tutors with filters
router.get("/get-kpis-data", sharedControllers.getKPIsData);  //Get all tutors with filters

export default router;
