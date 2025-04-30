import express from "express";
import { addSimCard, attachSimToUnit, createSimBatch, detachSimToUnit, findByESim2Provider, findBySim1Number, findBySimId, findSimByBatch, getAllSimBatches, getAttachedSimUnits, getSimNotAttached, getUnitsimNotAttached } from "../DBControllers/simControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.post("/create-sim-batch",Authentication, createSimBatch)

router.get("/get-all-simbatches",Authentication, getAllSimBatches)

router.post("/create-sim-card",Authentication, addSimCard)

router.get("/getsim-by-batch/:batch",Authentication, findSimByBatch)

router.get("/getsim-by-provider/:provider",Authentication, findByESim2Provider)

router.get("/getsim-by-number/:number",Authentication, findBySim1Number)

router.get("/getsim-by-id/:id",Authentication, findBySimId)

router.get("/get-unitnotAttached",Authentication, getUnitsimNotAttached)

router.get("/get-simnotAttached",Authentication, getSimNotAttached)

router.put("/attach-sim",Authentication, attachSimToUnit)

router.get("/get-attchedunits",Authentication, getAttachedSimUnits)

router.put("/detach-sim",Authentication, detachSimToUnit)


export default router