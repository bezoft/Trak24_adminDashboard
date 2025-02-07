import express from "express";
import { createOrUpdateUnit, getAllStock, getUserUnits, installUnit, searchUnitByImei } from "../DBControllers/unitsControllers.js";
const router = express.Router()


router.get("/search-unit/:imei", searchUnitByImei)


router.post("/config-new-unit", createOrUpdateUnit)

router.get("/getall-stock", getAllStock)

router.post("/install-new-unit", installUnit)

router.get("/get-units/:id", getUserUnits)

router.post("/config-new-unit", createOrUpdateUnit)

// router.post("/config-new-unit", createOrUpdateUnit)

// router.post("/config-new-unit", createOrUpdateUnit)

// router.post("/config-new-unit", createOrUpdateUnit)


export default router