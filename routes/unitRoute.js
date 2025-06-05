import express from "express";
import { createOrUpdateUnit, GetAddress, getAllStock, GetExpiringUnits, getRenewalUnit, getUnitByShipment, getUnitsByModel, getUserUnits, installUnit, RenewService, searchConfigUnitByImei, searchUnitByImei, UnitSettings } from "../DBControllers/unitsControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.get("/search-unit/:imei",Authentication ,searchUnitByImei)
router.get("/searchconfig-unit/:imei",Authentication, searchConfigUnitByImei)


router.post("/config-new-unit",Authentication, createOrUpdateUnit)

router.get("/getall-stock",Authentication, getAllStock)

router.post("/install-new-unit",Authentication, installUnit)

router.get("/get-units/:id",Authentication, getUserUnits)

router.post("/config-new-unit",Authentication, createOrUpdateUnit)

router.get("/expiring-units/:year/:month",Authentication, GetExpiringUnits)

 router.get("/get-unit-model/:status/:shipmentCode",Authentication, getUnitsByModel)

 router.get("/unit-shipment/:shipmentCode",Authentication, getUnitByShipment)

 router.get("/renewal-unit/:id",Authentication, getRenewalUnit)

 router.post("/renew-service",Authentication, RenewService)

 router.get("/get-address/:lat/:long/:lang", GetAddress)

 router.post("/update-unitsettings/:unitid",Authentication, UnitSettings)

export default router