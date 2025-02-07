import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    makeModels: [{
      type: String,
    }],
  },
);

export default mongoose.model("vehicles", vehicleSchema);
