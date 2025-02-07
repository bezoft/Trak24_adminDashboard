import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    shipmentCode: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    moreInfo: {
      type: String,
    },
    vendor: {
      type: String,
      required: true,
    },
    createdDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("shipments", shipmentSchema);
