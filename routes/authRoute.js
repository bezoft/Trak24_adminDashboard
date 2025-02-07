import express from "express";
import { AdminLogin } from "../DBControllers/authControllers.js";
const router = express.Router()


router.post("/admin-login", AdminLogin)


export default router