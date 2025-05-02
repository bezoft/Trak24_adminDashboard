import express from "express";
import { addAdmin, deleteAdmin, getAllAdmins, updateAdmin } from "../DBControllers/adminsControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.post("/new-admin",Authentication, addAdmin)

router.get("/all-admins",Authentication, getAllAdmins)

router.post("/update-admin/:id",Authentication, updateAdmin)

router.delete("/delete-admin/:id",Authentication, deleteAdmin)


export default router