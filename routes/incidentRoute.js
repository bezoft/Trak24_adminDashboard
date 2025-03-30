import express from "express";
import { addUpdateToIncident, createIncident, DeactivateIncident, getAllIncidents, getIncidentById, updateIncident } from "../DBControllers/IncidentControllers.js";
const router = express.Router()


router.post("/create-incident", createIncident)

//LOGIN

router.get("/getall-incidents", getAllIncidents)

router.get("/getincidents-by-id/:id", getIncidentById)

router.put("/add-update/:id", addUpdateToIncident)

router.put("/edit-incident/:id", updateIncident)

router.post("/deactive-incident/:id", DeactivateIncident)

export default router