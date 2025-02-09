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


export const createSimBatch = async (req, res) => {
  const { batchName, gsmProvider, purchaseDate, simCardnos, remarks } = req.body;

  try {
    // Validate required fields
    if (!gsmProvider) {
      return res.status(400).json({ success: false, message: "gsmProvider is required." });
    }

    // Create a new batch
    const newBatch = new SimBatchesModel({
      batchName,
      gsmProvider,
      purchaseDate,
      simCardnos: parseInt(simCardnos),
      remarks,
    });

    await newBatch.save();

    return res.status(201).json({
      success: true,
      message: "Batch created successfully.",
      data: newBatch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the batch.",
      error: error.message,
    });
  }
};



export const getAllSimBatches = async (req, res) => {
  try {
    // Fetch all batches from the database
    const batches = await SimBatchesModel.find();

    if (batches.length === 0) {
      return res.status(404).json({ success: false, message: "No batches found." });
    }

    return res.status(200).json({
      success: true,
      message: "Batches retrieved successfully.",
      data: batches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the batches.",
      error: error.message,
    });
  }
};



export const addSimCard = async (req, res) => {
  const {
    batch,
    sim1Number,
    eSim2Number,
    eSim2Provider,
    actDate,
    expyDate,
    eSimServProvider,
    simId,
    simType,
    serialNo,
    puc1,
    puc2,
  } = req.body;

  try {
    // Validate required fields
    if (!batch) {
      return res.status(400).json({ success: false, message: "Batch is required." });
    }

    // Create a new SIM card document
    const newSimCard = new SimCardsModel({
      batch,
      sim1Number: parseInt(sim1Number),
      eSim2Number: parseInt(eSim2Number),
      eSim2Provider,
      actDate,
      expyDate,
      eSimServProvider,
      simId: parseInt(simId),
      simType,
      serialNo: parseInt(serialNo),
      puc1: parseInt(puc1),
      puc2: parseInt(puc2),
    });

    // Save to the database
    await newSimCard.save();

    return res.status(201).json({
      success: true,
      message: "SIM card added successfully.",
      data: newSimCard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the SIM card.",
      error: error.message,
    });
  }
};



export const findSimByBatch = async (req, res) => {
  const { batch } = req.params;

  try {
    // Validate input
    if (!batch) {
      return res.status(400).json({ success: false, message: "Batch is required." });
    }

    // Fetch data by batch and populate related unit and user details
    const data = await SimCardsModel.find({ batch })
      .populate({
        path: 'unitid', // Populate the unitid reference in the SimCards schema
        select: 'imei assetRegNo assetMake assetModel model shipment', // Select the fields you want from the Units model
        populate: {
          path: 'customer', // Populate the customer reference in the Units schema (referencing the User model)
          select: 'firstname company', // Select the fields you want from the User model
        },
      })
      .exec();

    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "No records found for the specified batch." });
    }

    return res.status(200).json({
      success: true,
      message: "Records retrieved successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving data by batch.",
      error: error.message,
    });
  }
};



export const findByESim2Provider = async (req, res) => {
  const { provider } = req.params;
console.log(provider);

  try {
    // Validate input
    if (!provider) {
      return res.status(400).json({ success: false, message: "eSim2Provider is required." });
    }

    // Fetch data by eSim2Provider
    const data = await SimCardsModel.find({ eSim2Provider:provider }).populate({
      path: 'unitid', // Populate the unitid reference in the SimCards schema
      select: 'imei assetRegNo assetMake assetModel model shipment', // Select the fields you want from the Units model
      populate: {
        path: 'customer', // Populate the customer reference in the Units schema (referencing the User model)
        select: 'firstname company', // Select the fields you want from the User model
      },
    }).exec();

    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "No records found for the specified eSim2Provider." });
    }

    return res.status(200).json({
      success: true,
      message: "Records retrieved successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving data by eSim2Provider.",
      error: error.message,
    });
  }
};



export const findBySim1Number = async (req, res) => {
  const { number } = req.params;

  try {
    // Validate input
    if (!number) {
      return res.status(400).json({ success: false, message: "number is required." });
    }

    // Fetch data by number
    const data = await SimCardsModel.find({ eSim2Number:number }).populate({
      path: 'unitid', // Populate the unitid reference in the SimCards schema
      select: 'imei assetRegNo assetMake assetModel model shipment', // Select the fields you want from the Units model
      populate: {
        path: 'customer', // Populate the customer reference in the Units schema (referencing the User model)
        select: 'firstname company', // Select the fields you want from the User model
      },
    }).exec();

    if (!data) {
      return res.status(404).json({ success: false, message: "No record found for the specified sim1Number." });
    }

    return res.status(200).json({
      success: true,
      message: "Record retrieved successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving data by sim1Number.",
      error: error.message,
    });
  }
};



export const findBySimId = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "simId is required." });
    }

    // Fetch data by simId
    const data = await SimCardsModel.find({ simId: id  }).populate({
      path: 'unitid',
      select: 'imei assetRegNo assetMake assetModel model shipment',
      populate: {
        path: 'customer',
        select: 'firstname company',
      },
    }).exec();

    if (!data) {
      return res.status(404).json({ success: false, message: "No record found for the specified simId." });
    }

    return res.status(200).json({
      success: true,
      message: "Record retrieved successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving data by simId.",
      error: error.message,
    });
  }
};



export const getUnitsimNotAttached = async (req, res) => {
  try {
    // Query for units where simAttached is false
    const unitsData = await Units.find({ simAttached: false });

    if (unitsData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No units found where sim is not attached.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Units with sim not attached retrieved successfully.",
      data: unitsData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving units.",
      error: error.message,
    });
  }
};


export const getSimNotAttached = async (req, res) => {
  try {
    // Query for SIM cards where attached is false
    const unitsData = await SimCardsModel.find({ attached: false });

    if (unitsData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No SIM cards found where sim is not attached.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SIM cards not attached retrieved successfully.",
      data: unitsData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving SIM cards.",
      error: error.message,
    });
  }
};


export const attachSimToUnit = async (req, res) => {
  const { simid, unitid, simNumber } = req.body;

  try {
    // Find the unit and update `simAttached` to true and add the `simNumber`
    const updatedUnit = await Units.findByIdAndUpdate(
      unitid,
      {
        simAttached: true,
        simNumber: simNumber,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUnit) {
      return res.status(404).json({
        success: false,
        message: `No unit found with ID: ${unitid}`,
      });
    }

    // Find the SimCard and update `attached` to true and add the `unitId`
    const updatedSim = await SimCardsModel.findByIdAndUpdate(
      simid,
      {
        attached: true,
        unitid: unitid,
      },
      { new: true } // Return the updated document
    );

    if (!updatedSim) {
      return res.status(404).json({
        success: false,
        message: `No SIM card found with ID: ${simid}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "SIM successfully attached to the unit.",
      data: {
        unit: updatedUnit,
        simCard: updatedSim,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while attaching the SIM to the unit.",
      error: error.message,
    });
  }
};



export const getAttachedSimUnits = async (req, res) => {
  try {
    const attachedSimCards = await SimCardsModel.find({ attached: true }).populate({
      path: "unitid",
      select: "assetRegNo imei",
    });

    return res.status(200).json({
      success: true,
      message: "Attached SIM units retrieved successfully.",
      data: attachedSimCards,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attached SIM units.",
      error: error.message,
    });
  }
};



export const detachSimToUnit = async (req, res) => {
  const { simid, unitid, simNumber } = req.body;

  try {
    // Find the unit and update `simAttached` to false and remove the `simNumber`
    const updatedUnit = await Units.findByIdAndUpdate(
      unitid,
      {
        simAttached: false,
        simNumber: 0,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUnit) {
      return res.status(404).json({
        success: false,
        message: `No unit found with ID: ${unitid}`,
      });
    }

    // Find the SimCard and update `attached` to false and remove the `unitId`
    const updatedSim = await SimCardsModel.findByIdAndUpdate(
      simid,
      {
        attached: false,
        unitid: null,
      },
      { new: true } // Return the updated document
    );

    if (!updatedSim) {
      return res.status(404).json({
        success: false,
        message: `No SIM card found with ID: ${simid}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "SIM successfully detached from the unit.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while detaching the SIM from the unit.",
      error: error.message,
    });
  }
};


