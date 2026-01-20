const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  try {
    // Mongoose 7 changes strictQuery default; set explicitly to avoid noisy warnings
    mongoose.set("strictQuery", false);

    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    if (
      typeof mongoURI !== "string" ||
      (!mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://"))
    ) {
      throw new Error(
        'Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://".'
      );
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database connection error:", error.message);
    console.error(
      "Fix: set MONGODB_URI in server/.env (example: mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority)"
    );
    process.exit(1);
  }
};

module.exports = connect;
