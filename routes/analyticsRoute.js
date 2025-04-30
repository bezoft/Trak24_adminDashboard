import express from "express";
import { addAnalyticsData, getAnalyticsData } from "../DBControllers/analyticsControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.post("/add-analytics",Authentication, addAnalyticsData)

//LOGIN

router.get("/get-analytics",Authentication, getAnalyticsData)



export default router