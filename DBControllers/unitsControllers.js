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
    const existingData = await Units.findOne({ imei }, { reports: 0 ,liveData:0}).populate("customer", "company firstname _id");
if (existingData){
  res.status(200).json({ success: true, unit: [existingData] });
}else{
  res.status(204).json({ success: true, unit: null });
}

    
  } catch (error) {
    console.error("Error searching for unit:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const searchConfigUnitByImei = async (req, res) => {
  try {
    const { imei } = req.params; // Get IMEI from request parameters

    // Check if a document with the given IMEI exists
    const existingData = await Units.findOne({ imei }).populate("customer", "company firstname _id");
if (existingData){
  res.status(200).json({ success: true, unit: [existingData] });
}else{
  res.status(204).json({ success: true, unit: null });
}

    
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
    const { imei, customer, assetRegNo, assetMake, assetModel, gprsPort,installation,renewRange,expiry } = req.body;
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
    unit.installation = installation;
    unit.renewRange = renewRange;
    unit.expiry = expiry;
    unit.stockListed=false;

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

export const getRenewalUnit = async (req, res) => {
  try {
    const { id } = req.params; // Get customerId from the request parameters

    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "Customer ID is required." });
    }

    // Fetch units by customer ID and populate customer details
    const unitsData = await Units.findById(id)
    .select('-liveData -reports')
    .populate({
      path: 'customer',
      select: 'firstname company',
    }).exec();

    if (unitsData.length === 0) {
      return res.status(404).json({ success: false, message: "No units found for the specified customer." });
    }

    return res.status(200).json({
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


export const GetExpiringUnits=async (req, res) => {
  try {
    const { year, month } = req.params;

    // Convert month and year into a date range
    const startDate = new Date(`${year}-${month}-01T00:00:00.000+00:00`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Find units where expiry falls within the range
    const units = await Units.find(
      { expiry: { $gte: startDate, $lt: endDate } },
      { reports: 0 } // Exclude the reports field
    ).populate("customer", "company firstname _id");

    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUnitsByModel = async (req, res) => {
  try {
    const { status, shipmentCode } = req.params;

    const matchCondition = {};

    if (status && status !== "false") {
      matchCondition.status = status;
    } else if (shipmentCode) {
      matchCondition.shipment = shipmentCode; // Ensure this matches your DB field name
    }

    const unitsByModel = await Units.aggregate([
      {
        $match: matchCondition // Filtering based on status or shipmentCode
      },
      {
        $group: {
          _id: { status: "$status", model: "$model" },
          units: { 
            $push: {
              imei: "$imei",
              simAttached: "$simAttached",
              assetRegNo: "$assetRegNo",
              assetType: "$assetType",
              stockListed: "$stockListed",
              model: "$model",
              remarks: "$remarks",
              shipment: "$shipment",
              shipmentCode: "$shipmentCode",
              status: "$status",
              assetMake: "$assetMake",
              assetModel: "$assetModel",
              customer: "$customer",
              gprsPort: "$gprsPort",
              simNumber: "$simNumber",
              expiry: "$expiry",
              installation: "$installation",
              renewRange: "$renewRange"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          model: "$_id",
          units: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Units retrieved successfully.",
      data: unitsByModel,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};




export const getUnitByShipment = async (req, res) => {
  try {
    const { shipmentCode } = req.params;

    if (!shipmentCode) {
      return res.status(400).json({ message: "Shipment code is required" });
    }

    const unit = await Units.findOne({ shipment: shipmentCode }).select("-reports -liveData");

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Units retrieved successfully.",
      data: [unit],
    });
  } catch (error) {
    console.error("Error fetching unit by shipment code:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const RenewService = async (req, res) => {
  try {
    const { assetId, duration, renewalDate, expiry,newExpiry,customer,handler } = req.body;

    if (!assetId || !duration || !renewalDate || !expiry) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const unit = await Units.findById(assetId);
    if (!unit) {
      return res.status(404).json({ message: "Asset not found" });
    }


    const newRenewal = {
      customer:customer|| "NIL",
      expiredDate: expiry,
      renewalDate,
      duration,
      handler: handler || "NIL"
    };

    unit.renewals.push(newRenewal);
    unit.expiry = new Date(newExpiry);

    await unit.save();

    res.status(200).json({ message: "Service renewed successfully", unit });
  } catch (error) {
    console.error("Error renewing service:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const roundCoord = (value, decimals = 6) => {
  return Number(Number.parseFloat(value).toFixed(decimals));
};

export const GetAddress = async (req, res) => {
  try {
    const { lat, long, lang } = req.params;
    const lng = lang || 'en';

    const roundedLat = roundCoord(lat);
    const roundedLon = roundCoord(long);

    // Step 1: Check by coordinates (fast path)
    let existing = await CordinateAdress.findOne({ lat: roundedLat, lon: roundedLon });
    if (existing) {
      return res.status(200).json({ address: existing.address });
    } else {

      // Step 2: Fetch from Google API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBdtCj5H0N2_vLOHy4YuFKz_tc_NfPI5XI&language=${lng}`
      );
      const address = response.data.results[2]?.formatted_address || response.data.results[0]?.formatted_address;

      if (!address) {
        return res.status(404).json({ success: false, message: 'Address not found' });
      }

      // Step 3: Check if this address already exists (regardless of coordinates)
      existing = await CordinateAdress.findOne({ address });
      if (existing) {
        return res.status(200).json({ address: existing.address });
      }

      // Step 4: Save only if address is new
      const newEntry = new CordinateAdress({
        lat: roundedLat,
        lon: roundedLon,
        address,
        lastFetched: new Date(),
      });

      await newEntry.save();
      return res.status(200).json({ address });
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the address',
    });
  }
};