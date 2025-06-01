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
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 


// Routers
const authRouter = require("./routes/auth");
const rideRouter = require("./routes/ride");
const stripeRouter = require("./routes/stripe");

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
app.use("/stripe", stripeRouter);


app.post("/create-payment-sheet", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    // 1. Create Customer
    const customer = await stripe.customers.create();

    // 2. Create Ephemeral Key
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    // 3. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // e.g., 1099 for $10.99
      currency: currency, // e.g., "usd"
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    // 4. Send details to frontend
    res.send({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

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
