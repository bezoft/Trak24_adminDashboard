import AdminRoles from '../models/AdminRoles.js';
import bcrypt from 'bcrypt';

export const addAdmin = async (req, res) => {
  try {
    const { name, adminType, password, username } = req.body; // Extract data from request body
console.log(req.body);

    if (!name || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminRoles({
      name,
      username,
      adminType,
      password: hashedPassword,
    });

    // Save the new admin
    const savedAdmin = await newAdmin.save();
    
    res.status(201).json({ success: true, admin: savedAdmin });
  } catch (error) {
    console.error("Error adding admin:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getAllAdmins = async (req, res) => {
    try {
      const admins = await AdminRoles.find({}, { password: 0 }); // Exclude passwords from results
  
      res.status(200).json({ success: true, admins });
    } catch (error) {
      console.error("Error fetching admins:", error.message);
      res.status(500).json({ success: false, message: "Could not retrieve admins", error: error.message });
    }
  };



export const updateAdmin = async (req, res) => {
  const { id } = req.params; // Extract admin ID from request parameters
  const { name, username, password, adminType } = req.body; // Extract update data from the request body

  try {
    // Find the admin by _id
    const admin = await AdminRoles.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    // Update admin fields
    admin.name = name;
    admin.username = username;
    admin.adminType = adminType;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword; // Update the password if provided
    }

    await admin.save(); // Save the updated admin document

    return res.status(200).json({ success: true, message: "Admin updated successfully" });
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const deleteAdmin = async (req, res) => {
  const { id } = req.params; // Extract admin ID from request parameters

  try {
    // Find and delete the admin by _id
    const deletedAdmin = await AdminRoles.findByIdAndDelete(id);
    
    if (!deletedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    return res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
