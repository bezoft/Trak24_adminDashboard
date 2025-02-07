import express from "express";
import { addAdmin, deleteAdmin, getAllAdmins, updateAdmin } from "../DBControllers/adminsControllers.js";
const router = express.Router()


router.post("/new-admin", addAdmin)

router.get("/all-admins", getAllAdmins)

router.post("/update-admin/:id", updateAdmin)

router.delete("/delete-admin/:id", deleteAdmin)


export default router