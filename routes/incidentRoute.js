import express from "express";
import { addUpdateToIncident, createIncident, DeactivateIncident, getAllIncidents, getIncidentById, updateIncident } from "../DBControllers/IncidentControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.post("/create-incident",Authentication, createIncident)

//LOGIN

router.get("/getall-incidents",Authentication, getAllIncidents)

router.get("/getincidents-by-id/:id",Authentication, getIncidentById)

router.put("/add-update/:id",Authentication, addUpdateToIncident)

router.put("/edit-incident/:id",Authentication, updateIncident)

router.post("/deactive-incident/:id",Authentication, DeactivateIncident)

export default router