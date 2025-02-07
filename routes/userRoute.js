import express from "express";
import { addContact, createCustomer, getAllUsers, getContacts, getUserById, updatePermissions, updateUser, updateUsernameAndPassword } from "../DBControllers/userControllers.js";
const router = express.Router()


router.get("/all-users", getAllUsers)

router.post("/new-user", createCustomer)

router.get("/get-user/:id", getUserById)

router.put("/update-user/:id", updateUser)

router.put("/create-contact/:id", addContact)

router.get("/getcontacts-by-id/:id", getContacts)

router.post("/update-user/:id", updateUsernameAndPassword)

router.put("/update-permissions/:id", updatePermissions)


export default router