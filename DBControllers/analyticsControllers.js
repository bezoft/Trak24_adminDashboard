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


export const addUpdateToIncident = async (req, res) => {
  const { incidentId } = req.params; // Get incidentId from request parameters
  const { updateData } = req.body; // Get updateData from request body

  try {
    // Find the incident by its ID and push the new update into the updates array
    const updatedIncident = await IncidentModel.findByIdAndUpdate(
      incidentId,
      {
        $push: { updates: updateData },
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


export const addAnalyticsData = async (req, res) => {
  const {
    totalClients,
    totalUnits,
    activeUnits,
    incidents,
    stockUnits,
    totalRfids,
    ActiveRfids,
    expiredUnits,
    month,
    year,
    appUsers,
    webUsers,
  } = req.body;

  try {
    // Check if the analytics document already exists (assuming only one document for simplicity)
    let analytics = await AnalyticsModel.findOne();

    if (!analytics) {
      // If no analytics document exists, create a new one
      analytics = new AnalyticsModel({
        totalClients,
        totalUnits,
        activeUnits,
        incidents,
        stockUnits,
        totalRfids,
        ActiveRfids,
        expiredUnits,
        usage: [
          {
            month,
            year,
            appUsers,
            webUsers,
          },
        ],
      });

      await analytics.save();
      return res.status(201).json({ success: true, message: "New analytics data added successfully", data: analytics });
    }

    // If analytics document exists, check if the `usage` array has the same month and year
    const usageIndex = analytics.usage.findIndex(
      (entry) => entry.month === month && entry.year === year
    );

    if (usageIndex > -1) {
      // If the month and year already exist, update the relevant entry in the `usage` array
      analytics.usage[usageIndex] = {
        month,
        year,
        appUsers,
        webUsers,
      };
    } else {
      // If the month and year do not exist, add a new entry to the `usage` array
      analytics.usage.push({
        month,
        year,
        appUsers,
        webUsers,
      });
    }

    // Update other fields (if provided in the request)
    analytics.totalClients = (analytics.totalClients || 0) + (totalClients || 0);
    analytics.totalUnits = (analytics.totalUnits || 0) + (totalUnits || 0);
    analytics.activeUnits = (analytics.activeUnits || 0) + (activeUnits || 0);
    analytics.incidents = (analytics.incidents || 0) + (incidents || 0);
    analytics.stockUnits = (analytics.stockUnits || 0) + (stockUnits || 0);
    analytics.totalRfids = (analytics.totalRfids || 0) + (totalRfids || 0);
    analytics.ActiveRfids = (analytics.ActiveRfids || 0) + (ActiveRfids || 0);
    analytics.expiredUnits = (analytics.expiredUnits || 0) + (expiredUnits || 0);

    // Save the updated analytics document
    await analytics.save();

    return res.status(200).json({ success: true, message: "Analytics data updated successfully", data: analytics });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getAnalyticsData = async (req, res) => {
  try {
    const data = await AnalyticsModel.find(); // Fetch all analytics data

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
