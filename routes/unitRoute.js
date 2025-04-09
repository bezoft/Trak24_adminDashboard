import express from "express";
import { createOrUpdateUnit, getAllStock, GetExpiringUnits, getUnitByShipment, getUnitsByModel, getUserUnits, installUnit, searchConfigUnitByImei, searchUnitByImei } from "../DBControllers/unitsControllers.js";
const router = express.Router()


router.get("/search-unit/:imei", searchUnitByImei)
router.get("/searchconfig-unit/:imei", searchConfigUnitByImei)


router.post("/config-new-unit", createOrUpdateUnit)

router.get("/getall-stock", getAllStock)

router.post("/install-new-unit", installUnit)

router.get("/get-units/:id", getUserUnits)

router.post("/config-new-unit", createOrUpdateUnit)

router.get("/expiring-units/:year/:month", GetExpiringUnits)

 router.get("/get-unit-model/:status/:shipmentCode", getUnitsByModel)

 router.get("/unit-shipment/:shipmentCode", getUnitByShipment)

export default router