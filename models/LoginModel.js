import mongoose from "mongoose";

const loginhistorySchema = new mongoose.Schema({
  customer: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'users'
   },
  logins: [{
    platform: {
      type: Number
    },
    date: { 
      type: Date,
      default: Date.now
    }
  }]

});

// Default export for the model
export default mongoose.model("LoginHistory", loginhistorySchema);
