import express from "express";
import { addMakeModel, createMake, getAllMakes, getModelsByMake, updateVehicle } from "../DBControllers/vehiclesControllers.js";
const router = express.Router()


router.post("/create-vehicle", createMake)

router.post("/add-model", addMakeModel)

router.get("/get-all-makes", getAllMakes)

router.get("/get-models/:make", getModelsByMake)

router.post("/create-vehicle", createMake)

router.post("/update-vehicle/:id", updateVehicle)


export default router