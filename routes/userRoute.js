import express from "express";
import { addContact, createCustomer, getAllUsers, getContacts, getUserBasicInfoById, getUserById, updatePermissions, updateUser, updateUsernameAndPassword } from "../DBControllers/userControllers.js";
import { Authentication } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.get("/all-users",Authentication, getAllUsers)

router.post("/new-user",Authentication, createCustomer)

router.get("/get-user/:id",Authentication, getUserById)

router.put("/update-user/:id",Authentication, updateUser)

router.put("/create-contact/:id",Authentication, addContact)

router.get("/getcontacts-by-id/:id",Authentication, getContacts)

router.get("/basicinfo-by-id/:id",Authentication, getUserBasicInfoById)

router.post("/update-user/:id",Authentication, updateUsernameAndPassword)

router.put("/update-permissions/:id",Authentication, updatePermissions)


export default router