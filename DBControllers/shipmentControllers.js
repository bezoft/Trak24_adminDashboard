import AdminRoles from '../models/AdminRoles.js';
import Units from '../models/UnitsModel.js';
import ShipmentsModel from '../models/ShipmentsModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import VehiclesModel from '../models/VehiclesModel.js';
import SimBatchesModel from '../models/SimBatchesModel.js';
import SimCardsModel from '../models/SimCardsModel.js';
import IncidentModel from '../models/IncidentModel.js';
import AnalyticsModel from '../models/AnalyticsModel.js';


export const createShipment = async (req, res) => {
  try {
    const { shipmentCode, branch, quantity, moreInfo, vendor, createdDate } = req.body;

    // Validate required fields
    if (!shipmentCode || !branch || !quantity || !vendor || !createdDate) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // Create a new shipment
    const newShipment = new ShipmentsModel({
      shipmentCode,
      branch,
      quantity,
      moreInfo,
      vendor,
      createdDate,
    });

    // Save to database
    const savedShipment = await newShipment.save();

    res.status(200).json({ success: true, shipment: savedShipment });
  } catch (error) {
    console.error("Error creating shipment:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getAllShipmentCodes = async (req, res) => {
  try {
    const shipments = await ShipmentsModel.find({}, { shipmentCode: 1, _id: 0 });

    res.status(200).json({ success: true, shipmentCodes: shipments });
  } catch (error) {
    console.error("Error fetching shipment codes:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getAllShipments = async (req, res) => {
  try {
    const shipments = await ShipmentsModel.find({});

    res.status(200).json({ success: true, shipments: shipments });
  } catch (error) {
    console.error("Error fetching shipment codes:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
