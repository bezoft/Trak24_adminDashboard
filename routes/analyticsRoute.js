import express from "express";
import { addAnalyticsData, getAnalyticsData } from "../DBControllers/analyticsControllers.js";
const router = express.Router()


router.post("/add-analytics", addAnalyticsData)

//LOGIN

router.get("/get-analytics", getAnalyticsData)



export default router