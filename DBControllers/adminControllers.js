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


export const GetAllUsers = async () => {

  try {
    const allUsers = await User.find();
    return allUsers;

  } catch (error) {
    console.error(error);
  }
};

export const CreateCustomer = async (customerData) => {
  try {
    const {
      firstname,
      lastname,
      mobile,
      company,
      email,
      address,
      salesPerson,
      username,
      password,
      customerType,
    } = customerData;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    const newUser = new User({
      firstname,
      lastname,
      mobile,
      company,
      email,
      address,
      salesPerson,
      username,
      password: hashedPassword,
      customerType,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    let analytics = await AnalyticsModel.findOne();
    analytics.totalClients = (analytics.totalClients || 0) + 1;
    await analytics.save();
    return savedUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message); // Throwing error to handle it in the calling function
  }
};



export const AddAdmin = async (adminData) => {
  try {
    const { name, adminType, password, username } = adminData
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminRoles({
      name,
      username,
      adminType,
      password: hashedPassword,
    });

    // Save the new admin and return the saved object
    const savedAdmin = await newAdmin.save();
    return savedAdmin;
  } catch (error) {
    throw new Error('Error adding admin: ' + error.message);
  }
};


export const getAllAdmins = async () => {
  try {
    const admins = await AdminRoles.find({}, { password: 0 });
    return admins;
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw new Error("Could not retrieve admins");
  }
};


export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId); // Find the user by ID

    if (user) {
      return user
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateUser = async (userId, updateData) => {
  try {

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate updates against the schema
    });
    if (updatedUser) {
      return updatedUser
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error(error.message);
  }
};



// Create a new shipment
export const createShipment = async (shipmentData) => {
  try {
    const { shipmentCode, branch, quantity, moreInfo, vendor, createdDate } = shipmentData;
    if (!shipmentCode || !branch || !quantity || !vendor || !createdDate) {
      console.log("All required fields must be provided");
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

    if (savedShipment) {
      return savedShipment
    }
  } catch (error) {
    console.error("Error creating shipment:", error);
  }
};


export const SearchUnitId = async (imei) => {
  try {
    // Check if a document with the given IMEI already exists
    let existingData = await Units.findOne({ imei });

    if (existingData) {
      return existingData; // Return the updated data
    } else {
      return null
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateUnit = async (data) => {
  try {
    const { imei, shipment, model, remarks, status, stockListed } = data;

    // Check if a unit with the same IMEI already exists
    const existingUnit = await Units.findOne({ imei });

    if (existingUnit) {
      // Update the existing unit based on the IMEI (excluding IMEI)
      const updatedUnit = await Units.findOneAndUpdate(
        { imei }, // Filter by imei
        {
          $set: {
            shipment,
            model,
            remarks,
            status,
            stockListed,
          },
        },
        { new: true } // Return the updated document
      );

      return {
        success: true,
        status: 200,
        message: "Existing unit updated successfully.",
        data: updatedUnit,
      };
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
    let analytics = await AnalyticsModel.findOne();
    analytics.totalUnits = (analytics.totalUnits || 0) + 1;
    analytics.stockUnits = (analytics.stockUnits || 0) + 1;
    await analytics.save();

    return {
      success: true,
      status: 201,
      message: "New unit created successfully.",
      data: savedUnit,
    };
  } catch (error) {
    console.error("Error creating or updating unit:", error);
    return {
      success: false,
      status: 500,
      message: "An error occurred while processing the unit.",
      error: error.message,
    };
  }
};




export const GetAllStock = async () => {
  try {
    // Check if a document with the given IMEI already exists
    let stockData = await Units.find({ stockListed: true });

    if (stockData) {
      return stockData;
    } else {
      return null
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetAllShipmentCodes = async () => {
  try {
    const shipments = await ShipmentsModel.find({}, { shipmentCode: 1, _id: 0 });
    return shipments;
  } catch (error) {
    console.error("Error fetching shipment codes:", error);
    throw error;
  }
};

export const InstallUnit = async (data) => {
  try {
    const { imei, customer, assetRegNo, assetMake, assetModel, gprsPort } = data;

    let unit = await Units.findOne({ imei });
    // Create a new shipment
    if (unit) {
      unit.customer = customer || unit.customer;
      unit.assetRegNo = assetRegNo || unit.assetRegNo;
      unit.assetMake = assetMake || unit.assetMake;
      unit.assetModel = assetModel || unit.assetModel;
      unit.gprsPort = gprsPort || unit.gprsPort;
      unit.stockListed = false;
      // Save the updated unit
      await unit.save();

      const user = await User.findById(customer);

      if (user) {
        // Check if the IMEI already exists in the user's imeis array
        if (!user.imeis.includes(imei)) {
          // Add the IMEI to the user's imeis array
          user.imeis.push(imei);

          // Save the updated user
          await user.save();
          let analytics = await AnalyticsModel.findOne();
          analytics.activeUnits = (analytics.activeUnits || 0) + 1;
          await analytics.save();
        }
      } else {
        throw new Error("User not found");
      }


    }

    return { success: true, message: "Unit installed and user updated successfully" };

  } catch (error) {
    console.error("Error creating shipment:", error);
  }
};

export const GetUserUnits = async (customerId) => {
  try {
    // Validate input
    if (!customerId) {
      return { success: false, message: "Customer ID is required." };
    }

    // Fetch units by customer ID
    const unitsData = await Units.find({ customer: customerId }).populate({
      path: 'customer',
      select: 'firstname company contacts',
    })
      .exec(); // Populate customer details

    if (unitsData.length === 0) {
      return { success: false, message: "No units found for the specified customer." };
    }

    return {
      success: true,
      message: "Units retrieved successfully.",
      data: unitsData,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving units by customer.",
      error: error.message,
    };
  }
};

export const CreateMake = async (make) => {
  try {
    console.log(make);

    // Check if the make already exists
    const existingMake = await VehiclesModel.findOne({ make });
    if (existingMake) {
      return { success: false, message: "Make already exists.", data: existingMake };
    }

    // Create a new make if it doesn't exist
    const newMake = new VehiclesModel({ make });
    await newMake.save();

    return { success: true, message: "Make created successfully.", data: newMake };
  } catch (error) {
    console.error(error);

    return { success: false, message: "Failed to create make.", error: error.message };
  }
};


export const addMakeModel = async (make, makeModel) => {
  try {
    // Validate input
    if (!makeModel) {
      return { success: false, message: "Make model is required." };
    }
    console.log(make, makeModel);

    // Find the make and update its makeModels array
    const updatedMake = await VehiclesModel.findOneAndUpdate(
      { make },
      { $addToSet: { makeModels: makeModel } }, // $addToSet ensures no duplicates
      { new: true } // Return the updated document
    );

    if (!updatedMake) {
      return { success: false, message: "Make not found." };
    }

    return { success: true, message: "Make model added successfully.", data: updatedMake };
  } catch (error) {
    console.log(error);

    return { success: false, message: "An error occurred.", error: error.message };
  }
};


export const GetAllMakes = async () => {
  try {
    // Fetch all distinct makes from the Vehicle collection
    const makes = await VehiclesModel.find({}, 'make'); // Only select the `make` field
    if (makes.length === 0) {
      return { success: false, message: "No makes found." };
    }

    return { success: true, message: "Makes retrieved successfully.", data: makes };
  } catch (error) {
    return { success: false, message: "An error occurred.", error: error.message };
  }
};


export const GetModelsByMake = async (make) => {
  try {
    // Fetch the make document and retrieve its models
    const vehicle = await VehiclesModel.findOne({ make }, 'makeModels'); // Only select `makeModels`
    if (!vehicle) {
      return { success: false, message: "Make not found." };
    }

    return {
      success: true,
      message: `Models for make '${make}' retrieved successfully.`,
      data: vehicle.makeModels,
    };
  } catch (error) {
    return { success: false, message: "An error occurred.", error: error.message };
  }
};


export const UpdatePermissions = async (userId, updatedPermissions) => {
  try {
    // Find the user by ID and update the permissions field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { permissions: updatedPermissions } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return { success: false, message: "User not found." };
    }

    return {
      success: true,
      message: "Permissions updated successfully.",
      data: updatedUser.permissions,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while updating permissions.",
      error: error.message,
    };
  }
};



export const createSimBatch = async (batchData) => {
  const { batchName, gsmProvider, purchaseDate, simCardnos, remarks } = batchData;

  try {
    // Validate required fields
    if (!gsmProvider) {
      return { success: false, message: "gsmProvider is required." };
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

    return {
      success: true,
      message: "Batch created successfully.",
      data: newBatch,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while creating the batch.",
      error: error.message,
    };
  }
};


export const GetAllSimBatches = async () => {
  try {
    // Fetch all batches from the database
    const batches = await SimBatchesModel.find();

    if (batches.length === 0) {
      return { success: false, message: "No batches found." };
    }

    return {
      success: true,
      message: "Batches retrieved successfully.",
      data: batches,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching the batches.",
      error: error.message,
    };
  }
};

export const AddSimCard = async (simCardData) => {
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
  } = simCardData;

  try {
    // Validate required fields
    if (!batch) {
      return { success: false, message: "Batch is required." };
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

    return {
      success: true,
      message: "SIM card added successfully.",
      data: newSimCard,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while adding the SIM card.",
      error: error.message,
    };
  }
};

export const FindSimByBatch = async (batch) => {
  try {
    // Validate input
    if (!batch) {
      return { success: false, message: "Batch is required." };
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
      return { success: false, message: "No records found for the specified batch." };
    }

    return {
      success: true,
      message: "Records retrieved successfully.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving data by batch.",
      error: error.message,
    };
  }
};



export const FindByESim2Provider = async (eSim2Provider) => {
  try {
    // Validate input
    if (!eSim2Provider) {
      return { success: false, message: "eSim2Provider is required." };
    }

    // Fetch data by eSim2Provider
    const data = await SimCardsModel.find({ eSim2Provider }).populate({
      path: 'unitid', // Populate the unitid reference in the SimCards schema
      select: 'imei assetRegNo assetMake assetModel model shipment', // Select the fields you want from the Units model
      populate: {
        path: 'customer', // Populate the customer reference in the Units schema (referencing the User model)
        select: 'firstname company', // Select the fields you want from the User model
      },
    })
      .exec();


    if (data.length === 0) {
      return { success: false, message: "No records found for the specified eSim2Provider." };
    }

    return {
      success: true,
      message: "Records retrieved successfully.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving data by eSim2Provider.",
      error: error.message,
    };
  }
};


export const FindBySim1Number = async (sim1Number) => {
  try {
    // Validate input
    if (!sim1Number) {
      return { success: false, message: "sim1Number is required." };
    }

    // Fetch data by sim1Number
    const data = await SimCardsModel.find({ sim1Number }).populate({
      path: 'unitid', // Populate the unitid reference in the SimCards schema
      select: 'imei assetRegNo assetMake assetModel model shipment', // Select the fields you want from the Units model
      populate: {
        path: 'customer', // Populate the customer reference in the Units schema (referencing the User model)
        select: 'firstname company', // Select the fields you want from the User model
      },
    })
      .exec();

    if (!data) {
      return { success: false, message: "No record found for the specified sim1Number." };
    }

    return {
      success: true,
      message: "Record retrieved successfully.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving data by sim1Number.",
      error: error.message,
    };
  }
};


export const FindBySimId = async (simId) => {
  try {
    // Validate input
    if (!simId) {
      return { success: false, message: "simId is required." };
    }

    // Fetch data by simId
    const data = await SimCardsModel.find({ simId }).populate({
      path: 'unitid',
      select: 'imei assetRegNo assetMake assetModel model shipment',
      populate: {
        path: 'customer',
        select: 'firstname company',
      },
    })
      .exec();

    if (!data) {
      return { success: false, message: "No record found for the specified simId." };
    }

    return {
      success: true,
      message: "Record retrieved successfully.",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving data by simId.",
      error: error.message,
    };
  }
};



export const GetUnitsimNotAttached = async () => {
  try {
    // Query for units where simAttached is false
    const unitsData = await Units.find({ simAttached: false });

    if (unitsData.length === 0) {
      return {
        success: false,
        message: "No units found where sim is not attached.",
      };
    }

    return {
      success: true,
      message: "Units with sim not attached retrieved successfully.",
      data: unitsData,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving units.",
      error: error.message,
    };
  }
};

export const GetSimNotAttached = async () => {
  try {
    // Query for units where simAttached is false
    const unitsData = await SimCardsModel.find({ attached: false });

    if (unitsData.length === 0) {
      return {
        success: false,
        message: "No units found where sim is not attached.",
      };
    }

    return {
      success: true,
      message: "Units with sim not attached retrieved successfully.",
      data: unitsData,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while retrieving units.",
      error: error.message,
    };
  }
};


export const AttachSimToUnit = async (simId, unitId, simNumber) => {
  try {
    // Find the unit and update `simAttached` to true and add the `simNumber`
    const updatedUnit = await Units.findByIdAndUpdate(
      unitId,
      {
        simAttached: true,
        simNumber: simNumber,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUnit) {
      return {
        success: false,
        message: `No unit found with ID: ${unitId}`,
      };
    }

    // Find the SimCard and update `attached` to true and add the `unitId`
    const updatedSim = await SimCardsModel.findByIdAndUpdate(
      simId,
      {
        attached: true,
        unitid: unitId,
      },
      { new: true } // Return the updated document
    );

    if (!updatedSim) {
      return {
        success: false,
        message: `No SIM card found with ID: ${simId}`,
      };
    }

    return {
      success: true,
      message: "SIM successfully attached to the unit.",
      data: {
        unit: updatedUnit,
        simCard: updatedSim,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while attaching the SIM to the unit.",
      error: error.message,
    };
  }
};

export const GetAttachedSimUnits = async () => {
  try {
    const attachedSimCards = await SimCardsModel.find({ attached: true }).populate({
      path: "unitid",
      select: "assetRegNo imei",
    });

    return {
      success: true,
      status: 200,
      data: attachedSimCards,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "Failed to fetch data",
      error: error.message,
    };
  }
};


export const DetachSimToUnit = async (simId, unitId, simNumber) => {
  try {
    // Find the unit and update `simAttached` to true and add the `simNumber`
    const updatedUnit = await Units.findByIdAndUpdate(
      unitId,
      {
        simAttached: false,
        simNumber: 0,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUnit) {
      return {
        success: false,
        message: `No unit found with ID: ${unitId}`,
      };
    }

    // Find the SimCard and update `attached` to true and add the `unitId`
    const updatedSim = await SimCardsModel.findByIdAndUpdate(
      simId,
      {
        attached: false,
        unitid: null
      },
      { new: true } // Return the updated document
    );

    if (!updatedSim) {
      return {
        success: false,
        message: `No SIM card found with ID: ${simId}`,
      };
    }

    return {
      success: true,
      message: "SIM successfully Detached from unit.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while attaching the SIM to the unit.",
      error: error.message,
    };
  }
};


export const AddContact = async (userId, contact) => {
  try {
    if (!userId || !contact) {
      throw new Error("User ID and contact details are required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.contacts.push(contact); // Add the contact to the user's contacts array

    await user.save(); // Save the updated user document

    return { success: true, message: "Contact added successfully", user };
  } catch (error) {
    console.log(error);

    return { success: false, message: error.message, error };
  }
};

// Get all contacts for a user
export const GetContacts = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, message: "Contacts retrieved successfully", contacts: user.contacts };
  } catch (error) {
    return { success: false, message: error.message, error };
  }
};


export const CreateIncident = async (data) => {
  try {
    // Destructure the data argument
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
    } = data;

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
    let analytics = await AnalyticsModel.findOne();
    analytics.incidents = (analytics.incidents || 0) + 1;
    await analytics.save();

    // Return the saved data
    return { success: true, message: "Incident added successfully" };
  } catch (error) {
    // Throw an error to be handled by the calling function
    throw new Error(`Error creating incident: ${error.message}`);
  }
};


export const GetAllIncidents = async () => {
  try {
    // Fetch all incidents from the database
    const incidents = await IncidentModel.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate({
        path: "unit",
        select: "-liveData -reports", // Excluding liveData and reports from unit
      })
      .populate({
        path: "userid",
        select: "-geoFences -imeis -password -permissions -contacts -address -email -username", // Excluding sensitive fields from user
      });

    return incidents;
  } catch (error) {
    // Throw an error to be handled by the calling function
    throw new Error(`Error fetching incidents: ${error.message}`);
  }
};


export const GetIncidentById = async (id) => {
  try {
    // Find the incident by _id
    const incident = await IncidentModel.findById(id).populate("unit userid"); // Populate referenced fields if needed

    if (!incident) {
      throw new Error("Incident not found");
    }

    return [incident]; // Return the found incident
  } catch (error) {
    // Throw an error to be handled by the calling function
    throw new Error(`Error fetching incident by ID: ${error.message}`);
  }
};


export const AddUpdateToIncident = async (incidentId, updateData) => {
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
      throw new Error("Incident not found");
    }

    return { success: true, message: "Updates added successfully" };
  } catch (error) {
    // Throw an error to be handled by the calling function
    throw new Error(`Error adding update to incident: ${error.message}`);
  }
};



export const AddAnalyticsData = async (data) => {
  try {
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
    } = data;

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
      return { success: true, message: "New analytics data added successfully", data: analytics };
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

    return { success: true, message: "Analytics data updated successfully", data: analytics };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


// Get Analytics Data
export const GetAnalyticsData = async () => {
  try {
    const data = await AnalyticsModel.find(); // Pass filters through `query`
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};




export const UpdateVehicle = async (id, updateData) => {
  try {
    // Find the unit by _id and update the specified fields
    const updatedUnit = await Units.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // If unit is not found, return null
    if (!updatedUnit) {
      return null;
    }

    return { success: true, message: "Updates added successfully" };
  } catch (error) {
    console.error("Error updating unit:", error);
    throw new Error("Internal server error");
  }
};

export const UpdateIncident = async (incidentId, updateData) => {
  try {


    if (!incidentId || !updateData) {
      throw new Error("Incident ID and update data are required.");
    }

    const updatedIncident = await IncidentModel.findByIdAndUpdate(
      incidentId,
      { $set: updateData },
      { new: true } // Returns the updated document
    );

    if (!updatedIncident) {
      throw new Error("Incident not found.");
    }

    return { message: "Incident updated successfully", updatedIncident };
  } catch (error) {
    console.log(error);

    throw new Error(`Error updating incident: ${error.message}`);
  }
};


export const UpdateUsernameAndPassword = async (userId, data) => {
  try {
    // Extract new username and password from data
    const { username, password } = data;

    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    console.log("Fetching user from DB..."); // Debug log
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);


    console.log("Updating user..."); // Debug log
    user.username = username;
    user.password = hashedPassword;
    await user.save();

    console.log("User updated successfully."); // Debug log
    return { message: "Username and password updated successfully", };
  } catch (error) {
    console.error("Error updating user:", error); // More detailed logging
    throw new Error(`Error updating username and password: ${error.message}`);
  }
};

export const UpdateAdmin = async (id, updateData) => {
  try {
    const { name,
      username,
      password,
      adminType } = updateData;
    // Find the admin by _id and update the fields
    const Admin = await AdminRoles.findById(id);
    if (!Admin) {
      throw new Error("admin not found.");
    }

    Admin.name = name;
    Admin.username = username;
    Admin.adminType = adminType;
    Admin.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      Admin.password = hashedPassword
    }
    await Admin.save();
    return { message: "Admin Deleted successfully", };

  } catch (error) {
    console.error("Error updating admin:", error);
    throw new Error("Internal server error");
  }
};

export const DeleteAdmin = async (id) => {
  try {

    await AdminRoles.findByIdAndDelete(id);
    return { status: 200, message: "Admin deleted successfully" };

  } catch (error) {
    console.error("Error updating admin:", error);
    throw new Error("Internal server error");
  }
};