import express from "express";
import { createShipment, getAllShipmentCodes, getAllShipments } from "../DBControllers/shipmentControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.post("/new-shipment",Authentication, createShipment)

router.get("/getall-shipmentcodes",Authentication, getAllShipmentCodes)

router.get("/getall-shipments",Authentication, getAllShipments)


export default router