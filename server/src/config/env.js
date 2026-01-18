require("dotenv").config();

const env = {
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-change-in-production",
  
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3001",
};

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

requiredEnvVars.forEach((varName) => {
  if (!env[varName]) {
    console.warn(`Warning: ${varName} is not set in environment variables`);
  }
});

module.exports = env;
