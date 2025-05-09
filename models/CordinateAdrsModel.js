import mongoose from "mongoose";


// Define schema
const CordinateAdrsModel = new mongoose.Schema({
  lat: {
    type: Number,
  },
  lon: {
    type: Number
  },
  address: {
    type: String
  },
  lastFetched: {
    type: Date
  },
});
CordinateAdrsModel.index({ address: 1 }, { unique: true });

// Create model using the local connection
export default mongoose.model("CordinateAdress", CordinateAdrsModel);