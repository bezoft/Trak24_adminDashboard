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

export const createMake = async (req, res) => {
  try {
    const { make } = req.body; // Extract 'make' from the request body

    // Check if the make already exists
    const existingMake = await VehiclesModel.findOne({ make });
    if (existingMake) {
      return res.status(400).json({ success: false, message: "Make already exists.", data: existingMake });
    }

    // Create a new make if it doesn't exist
    const newMake = new VehiclesModel({ make });
    await newMake.save();

    res.status(201).json({ success: true, message: "Make created successfully.", data: newMake });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create make.", error: error.message });
  }
};



export const addMakeModel = async (req, res) => {
  try {
    const { make, model } = req.body; // Extract 'make' and 'makeModel' from the request body

    // Validate input
    if (!model) {
      return res.status(400).json({ success: false, message: "Make model is required." });
    }

    // Find the make and update its makeModels array
    const updatedMake = await VehiclesModel.findOneAndUpdate(
      { make },
      { $addToSet: { makeModels: model } }, // $addToSet ensures no duplicates
      { new: true } // Return the updated document
    );

    if (!updatedMake) {
      return res.status(404).json({ success: false, message: "Make not found." });
    }

    res.status(200).json({ success: true, message: "Make model added successfully.", data: updatedMake });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "An error occurred.", error: error.message });
  }
};



export const getAllMakes = async (req, res) => {
  try {
    // Fetch all distinct makes from the Vehicle collection
    const makes = await VehiclesModel.find({}, 'make'); // Only select the `make` field
    if (makes.length === 0) {
      return res.status(404).json({ success: false, message: "No makes found." });
    }

    res.status(200).json({ success: true, message: "Makes retrieved successfully.", data: makes });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred.", error: error.message });
  }
};



export const getModelsByMake = async (req, res) => {
  try {
    const { make } = req.params; // Get 'make' from the request parameters

    // Fetch the make document and retrieve its models
    const vehicle = await VehiclesModel.findOne({ make }, 'makeModels'); // Only select `makeModels`
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Make not found." });
    }

    res.status(200).json({
      success: true,
      message: `Models for make '${make}' retrieved successfully.`,
      data: vehicle.makeModels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred.", error: error.message });
  }
};


export const updateVehicle = async (req, res) => {
  const { id } = req.params; // Get id from request parameters
  const updateData = req.body; // Get updateData from the request body

  try {
    // Find the unit by _id and update the specified fields
    const updatedUnit = await Units.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // If unit is not found, return 404
    if (!updatedUnit) {
      return res.status(404).json({ success: false, message: "Unit not found" });
    }

    return res.status(200).json({ success: true, message: "Updates added successfully", data: updatedUnit });
  } catch (error) {
    console.error("Error updating unit:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
