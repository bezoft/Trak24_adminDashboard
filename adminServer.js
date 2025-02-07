import express from "express"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from "cors"
import { AddAdmin, AddAnalyticsData, AddContact, addMakeModel, AddSimCard, AddUpdateToIncident, AttachSimToUnit, CreateCustomer, CreateIncident, CreateMake, createShipment, createSimBatch, CreateUnit, DeleteAdmin, DetachSimToUnit, FindByESim2Provider, FindBySim1Number, FindBySimId, FindSimByBatch, getAllAdmins, GetAllIncidents, GetAllMakes, GetAllShipmentCodes, GetAllSimBatches, GetAllStock, GetAllUsers, GetAnalyticsData, GetAttachedSimUnits, GetContacts, GetIncidentById, GetModelsByMake, GetSimNotAttached, GetUnitsimNotAttached, getUserById, GetUserUnits, InstallUnit, SearchUnitId, UpdateAdmin, UpdateIncident, UpdatePermissions, updateUser, UpdateUsernameAndPassword, UpdateVehicle } from "./DBControllers/adminControllers.js";
import AdminRoles from "./models/AdminRoles.js";
import { connectToDatabase } from "./helpers/db.js";
import authRoute from "./routes/authRoute.js"
import unitRoute from "./routes/unitRoute.js"
import simRoute from "./routes/simRoute.js"
import incidentRoute from "./routes/incidentRoute.js"
import shipmentRoute from "./routes/shipmentRoute.js"
import vehicleRoute from "./routes/vehicleRoute.js"
import analyticsRoute from "./routes/analyticsRoute.js"
import adminRoute from "./routes/adminRoute.js"
import userRoute from "./routes/userRoute.js"
import { dirname } from 'path';
import { fileURLToPath } from 'url';  // Import fileURLToPath
import path from 'path';


const app = express();

app.use(cors({
  origin: '*',  // Allow requests from any origin
}));
app.use(express.json());


app.use("/api-trkadn",authRoute)
app.use("/api-trkadn",unitRoute)
app.use("/api-trkadn",simRoute)
app.use("/api-trkadn",incidentRoute)
app.use("/api-trkadn",shipmentRoute)
app.use("/api-trkadn",vehicleRoute)
app.use("/api-trkadn",analyticsRoute)
app.use("/api-trkadn",adminRoute)
app.use("/api-trkadn",userRoute)


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'admin-portal', 'build', 'index.html'));
});

app.listen(7025, () => {
  console.log('Admin Portal server is running on port 7025');
  connectToDatabase()
});



