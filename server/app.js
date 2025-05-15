require("dotenv").config();
require("express-async-errors");

const EventEmitter = require("events");
EventEmitter.defaultMaxListeners = 20;

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authentication");
const cloudinary = require("cloudinary").v2;

// Routers
const authRouter = require("./routes/auth");
const rideRouter = require("./routes/ride");

// Import socket handler
const handleSocketConnection = require("./controllers/sockets");
const { buildAdminRouter, admin } = require("./config/setup");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: "*" } });

// Attach the WebSocket instance to the request object
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Initialize WebSocket handling logic
handleSocketConnection(io);

// Routes
app.use("/auth", authRouter);
app.use("/ride", authMiddleware, rideRouter);

// Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    // Database connection
    await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/asbab");

    // Set up AdminJS routes after DB connection
    // await buildAdminRouter(app);

    // Start the server
    server.listen(process.env.PORT || 3000, () => {
      console.log(
        // `HTTP server is running on http://localhost:${process.env.PORT}${admin.options.rootPath}`
         `HTTP server is running on http://localhost:${process.env.PORT}`

      );
    });

  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
