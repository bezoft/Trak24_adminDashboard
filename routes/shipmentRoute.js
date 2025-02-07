import express from "express";
import { createShipment, getAllShipmentCodes } from "../DBControllers/shipmentControllers.js";
const router = express.Router()


router.post("/new-shipment", createShipment)

router.get("/getall-shipmentcodes", getAllShipmentCodes)


export default router