import mongoose from "mongoose";

const simbatchesSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
    },
    gsmProvider: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: String,
    },
    simCardnos: {
      type: Number,
    },
    remarks: {
      type: String,
    }
  },
);

export default mongoose.model("SimBatches", simbatchesSchema);
