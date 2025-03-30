import mongoose from "mongoose";

const simCardsSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: true,
    },
    unitid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Units',
    },
    sim1Number: {
      type: Number,
    },
    eSim2Number: {
      type: Number,
    },
    eSim2Provider: {
      type: String,
    },
    actDate: {
      type: String,
    },
    expyDate: {
      type: String,
    },
    eSimServProvider: {
      type: String,
    },
    simId: {
      type: Number,
    },
    simType: {
      type: String,
    },
    serialNo: {
      type: Number,
    },
    puc1: {
      type: Number,
    },
    puc2: {
      type: Number,
    },
    attached: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true }
);

export default mongoose.model("SimCards", simCardsSchema);
