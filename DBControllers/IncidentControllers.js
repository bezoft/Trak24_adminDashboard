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


export const createIncident = async (req, res) => {
  const {
    unit,
    userid,
    caseType,
    caseDesc,
    details,
    created,
    priority,
    response,
    cuvisible,
    caseAssigned,
  } = req.body;

  console.log(unit,
    userid,
    caseType,
    caseDesc,
    details,
    created,
    priority,
    response,
    cuvisible,
    caseAssigned,);
  

  try {
    // Create a new Incident instance
    const newIncident = new IncidentModel({
      unit,
      userid,
      caseType,
      caseDesc: parseInt(caseDesc),
      details,
      response,
      priority,
      created,
      cuvisible,
      caseAssigned,
    });

    // Save the new Incident to the database
    await newIncident.save();

    // Update analytics
    let analytics = await AnalyticsModel.findOne();
    analytics.incidents = (analytics.incidents || 0) + 1;
    await analytics.save();

    return res.status(201).json({ success: true, message: "Incident added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Error creating incident: ${error.message}` });
  }
};



export const getAllIncidents = async (req, res) => {
  try {
    // Fetch all incidents from the database
    const incidents = await IncidentModel.find({ status: 1 })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate({
        path: "unit",
        select: "-liveData -reports", // Excluding liveData and reports from unit
      })
      .populate({
        path: "userid",
        select: "-geoFences -imeis -password -permissions -contacts -address -email -username", // Excluding sensitive fields from user
      });

    return res.status(200).json({ success: true, data: incidents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Error fetching incidents: ${error.message}` });
  }
};



export const getIncidentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the incident by _id
    const incident = await IncidentModel.findById(id).populate("unit userid"); // Populate referenced fields if needed

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    return res.status(200).json({ success: true, data: [incident] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Error fetching incident by ID: ${error.message}` });
  }
};


export const addUpdateToIncident = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the incident by its ID and push the new update into the updates array
    const updatedIncident = await IncidentModel.findByIdAndUpdate(
      id,
      {
        $push: { updates: req.body },
      },
      { new: true } // Return the updated document
    );

    // Check if the incident was found
    if (!updatedIncident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }
   
    
    return res.status(200).json({ success: true, message: "Updates added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Error adding update to incident: ${error.message}` });
  }
};



export const updateIncident = async (req, res) => {
  const { id } = req.params; // Get incidentId from request parameters
  const updateData = req.body; // Get updateData from request body

  try {
    // Validate input
    if (!id || !updateData) {
      return res.status(400).json({ success: false, message: "Incident ID and update data are required." });
    }

    // Find and update the incident
    const updatedIncident = await IncidentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    // Check if the incident exists
    if (!updatedIncident) {
      return res.status(404).json({ success: false, message: "Incident not found." });
    }

    return res.status(200).json({ success: true, message: "Incident updated successfully", data: updatedIncident });
  } catch (error) {
    console.error("Error updating incident:", error.message);
    return res.status(500).json({ success: false, message: `Error updating incident: ${error.message}` });
  }
};


export const DeactivateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await IncidentModel.findByIdAndUpdate(id, { status: 0 }, { new: true });

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }
    let analytics = await AnalyticsModel.findOne();
    analytics.incidents = analytics.incidents-1;
    await analytics.save();
    return res.status(200).json({ success: true, message: "Incident deactivated successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Error updating incident: ${error.message}` });
  }
};