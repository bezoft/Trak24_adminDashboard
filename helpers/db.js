import mongoose from "mongoose";

const mongoURI = "mongodb://trak_user:,Trak24$24$.com,@148.113.6.141:28025/trak24";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

    // Listen for disconnection and attempt to reconnect
    mongoose.connection.on("disconnected", () => {
      console.error("MongoDB disconnected! Trying to reconnect...");
      connectToDatabase(); // Reconnect
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected!");
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
  }
};



export default mongoose.connection;
