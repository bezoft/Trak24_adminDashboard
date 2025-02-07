import express from "express";
import { addSimCard, attachSimToUnit, createSimBatch, detachSimToUnit, findByESim2Provider, findBySim1Number, findBySimId, findSimByBatch, getAllSimBatches, getAttachedSimUnits, getSimNotAttached, getUnitsimNotAttached } from "../DBControllers/simControllers.js";
const router = express.Router()


router.post("/create-sim-batch", createSimBatch)

router.get("/get-all-simbatches", getAllSimBatches)

router.post("/create-sim-card", addSimCard)

router.get("/getsim-by-batch/:batch", findSimByBatch)

router.get("/getsim-by-provider/:provider", findByESim2Provider)

router.get("/getsim-by-number/:number", findBySim1Number)

router.get("/getsim-by-id/:id", findBySimId)

router.get("/get-unitnotAttached", getUnitsimNotAttached)

router.get("/get-simnotAttached", getSimNotAttached)

router.put("/attach-sim", attachSimToUnit)

router.get("/get-attchedunits", getAttachedSimUnits)

router.put("/detach-sim", detachSimToUnit)


export default router