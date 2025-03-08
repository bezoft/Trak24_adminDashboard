import express from "express";
import { createShipment, getAllShipmentCodes, getAllShipments } from "../DBControllers/shipmentControllers.js";
const router = express.Router()


router.post("/new-shipment", createShipment)

router.get("/getall-shipmentcodes", getAllShipmentCodes)

router.get("/getall-shipments", getAllShipments)


export default router