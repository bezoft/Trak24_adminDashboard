import express from "express";
import { addMakeModel, createMake, getAllMakes, getModelsByMake, updateVehicle } from "../DBControllers/vehiclesControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.post("/create-vehicle",Authentication, createMake)

router.post("/add-model",Authentication, addMakeModel)

router.get("/get-all-makes",Authentication, getAllMakes)

router.get("/get-models/:make",Authentication, getModelsByMake)

router.post("/create-vehicle",Authentication, createMake)

router.post("/update-vehicle/:id",Authentication, updateVehicle)


export default router