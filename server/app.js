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
const complaintRouter = require("./routes/complains");

// AdminJS setup
const { buildAdminRouter, admin } = require("./config/setup");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());

// Attach WebSocket instance to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Log all incoming requests
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// Stripe Payment Sheet Route
app.post("/create-payment-sheet", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

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

// Socket handler (placed here if it modifies `io`)
const handleSocketConnection = require("./controllers/sockets");
handleSocketConnection(io);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/asbab");

    // ✅ Mount AdminJS first
    await buildAdminRouter(app);

    // ✅ Then mount other app routes
    app.use("/auth", authRouter);
    app.use("/ride", authMiddleware, rideRouter);
    app.use("/complaint", complaintRouter);

    // ✅ Then add fallback middlewares
    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);

    server.listen(PORT, () => {
      console.log(`HTTP server is running at http://localhost:${PORT}`);
      console.log(`✅ AdminJS is running at http://localhost:${PORT}${admin.options.rootPath}`);
    });

  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
