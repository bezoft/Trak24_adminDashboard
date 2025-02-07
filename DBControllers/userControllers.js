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


export const getAllUsers = async (req, res) => {
    try {
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  export const createCustomer = async (req, res) => {
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
      } = req.body;
  
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
  
      // Update analytics
      let analytics = await AnalyticsModel.findOne();
      if (analytics) {
        analytics.totalClients = (analytics.totalClients || 0) + 1;
        await analytics.save();
      }
  
      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get userId from request parameters
    const user = await User.findById(id); // Find the user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract userId from request parameters

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate updates against the schema
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};



export const addContact = async (req, res) => {
  const { id } = req.params; // Extract userId from request parameters

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "User ID and contact details are required" });
    }

    // Find the user by userId
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Add the contact to the user's contacts array
    user.contacts.push(req.body);

    // Save the updated user document
    await user.save();

    return res.status(200).json({ success: true, message: "Contact added successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message, error });
  }
};



export const getContacts = async (req, res) => {
  const { id } = req.params; // Extract userId from request parameters

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Find the user by userId
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Contacts retrieved successfully", contacts: user.contacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, error });
  }
};


export const updateUsernameAndPassword = async (req, res) => {
  const { id } = req.params; // Extract userId from request parameters
  const { username, password } = req.body; // Extract username and password from the request body


  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    console.log("Fetching user from DB..."); // Debug log
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword); // Debug log

    console.log("Updating user..."); // Debug log
    user.username = username;
    user.password = hashedPassword;
    await user.save();

    console.log("User updated successfully."); // Debug log
    return res.status(200).json({ success: true, message: "Username and password updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error); // More detailed logging
    return res.status(500).json({ success: false, message: `Error updating username and password: ${error.message}` });
  }
};


export const updatePermissions = async (req, res) => {
  const { id } = req.params; // Extract userId from request parameters

  try {
    // Validate input
    if (!id) {
      return res.status(400).json({ success: false, message: "User ID and updated permissions are required." });
    }

    // Find the user by ID and update the permissions field
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { permissions: req.body } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Permissions updated successfully.",
      data: updatedUser.permissions,
    });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating permissions.",
      error: error.message,
    });
  }
};
