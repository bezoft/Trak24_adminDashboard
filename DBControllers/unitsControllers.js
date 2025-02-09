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


export const searchUnitByImei = async (req, res) => {
  try {
    const { imei } = req.params; // Get IMEI from request parameters

    // Check if a document with the given IMEI exists
    const existingData = await Units.findOne({ imei });


    res.status(200).json({ success: true, unit: existingData });
  } catch (error) {
    console.error("Error searching for unit:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const createOrUpdateUnit = async (req, res) => {
  try {
    const { imei, shipment, model, remarks, status, stockListed } = req.body;

    // Check if a unit with the same IMEI already exists
    const existingUnit = await Units.findOne({ imei });

    if (existingUnit) {
      // Update the existing unit based on the IMEI (excluding IMEI)
      const updatedUnit = await Units.findOneAndUpdate(
        { imei }, // Filter by IMEI
        {
          $set: { shipment, model, remarks, status, stockListed },
        },
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        success: true,
        message: "Existing unit updated successfully.",
        data: updatedUnit,
      });
    }

    // If no existing unit, create a new one
    const newUnit = new Units({
      imei,
      shipment,
      model,
      remarks,
      status,
      stockListed,
    });

    // Save to database
    const savedUnit = await newUnit.save();

    // Update analytics
    let analytics = await AnalyticsModel.findOne();
    if (analytics) {
      analytics.totalUnits = (analytics.totalUnits || 0) + 1;
      analytics.stockUnits = (analytics.stockUnits || 0) + 1;
      await analytics.save();
    }

    return res.status(200).json({
      success: true,
      message: "New unit created successfully.",
      data: savedUnit,
    });
  } catch (error) {
    console.error("Error creating or updating unit:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the unit.",
      error: error.message,
    });
  }
};


export const getAllStock = async (req, res) => {
  try {
    // Find all units with stockListed set to true
    const stockData = await Units.find({ stockListed: true });

    if (!stockData || stockData.length === 0) {
      return res.status(404).json({ success: false, message: "No stock data found" });
    }

    res.status(200).json({ success: true, stock: stockData });
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



export const installUnit = async (req, res) => {
  try {
    const { imei, customer, assetRegNo, assetMake, assetModel, gprsPort } = req.body;
console.log(req.body);

    // Find the unit by IMEI
    let unit = await Units.findOne({ imei });

    if (!unit) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    // Update unit details
    unit.customer = customer || unit.customer;
    unit.assetRegNo = assetRegNo || unit.assetRegNo;
    unit.assetMake = assetMake || unit.assetMake;
    unit.assetModel = assetModel || unit.assetModel;
    unit.gprsPort = gprsPort || unit.gprsPort;
    unit.stockListed = false;

    // Save the updated unit
    await unit.save();

    // Find user by customer ID
    const user = await User.findById(customer);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the IMEI already exists in the user's imeis array
    if (!user.imeis.includes(imei)) {
      user.imeis.push(imei); // Add the IMEI to the user's imeis array

      // Save the updated user
      await user.save();

      // Update analytics
      let analytics = await AnalyticsModel.findOne();
      if (analytics) {
        analytics.activeUnits = (analytics.activeUnits || 0) + 1;
        await analytics.save();
      }
    }

    res.status(200).json({ success: true, message: "Unit installed and user updated successfully" });
  } catch (error) {
    console.error("Error installing unit:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getUserUnits = async (req, res) => {
  try {
    const { id } = req.params; // Get customerId from the request parameters

    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "Customer ID is required." });
    }

    // Fetch units by customer ID and populate customer details
    const unitsData = await Units.find({ customer: id }).populate({
      path: 'customer',
      select: 'firstname company contacts',
    }).exec();

    if (unitsData.length === 0) {
      return res.status(404).json({ success: false, message: "No units found for the specified customer." });
    }

    return res.status(200).json({
      success: true,
      message: "Units retrieved successfully.",
      data: unitsData,
    });
  } catch (error) {
    console.error("Error retrieving units by customer:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving units by customer.",
      error: error.message,
    });
  }
};




