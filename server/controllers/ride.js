
const Ride = require("../models/Ride");
const Rating = require("../models/Rating");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  calculateDistance,
  calculateFare,
  generateOTP,
} = require("../utils/mapUtils");

const createRide = async (req, res) => {
  const { vehicle, pickup, drop, loadDetails, paymentMethod, currency = "pkr" } = req.body;

  if (!vehicle || !pickup || !drop) {
    throw new BadRequestError("Vehicle, pickup, and drop details are required");
  }

  const {
    address: pickupAddress,
    latitude: pickupLat,
    longitude: pickupLon,
  } = pickup;

  const { address: dropAddress, latitude: dropLat, longitude: dropLon } = drop;

  if (!pickupAddress || !pickupLat || !pickupLon || !dropAddress || !dropLat || !dropLon) {
    throw new BadRequestError("Complete pickup and drop details are required");
  }

  if ((vehicle === "truck" || vehicle === "van") && (!loadDetails?.type || !loadDetails?.weight)) {
    throw new BadRequestError("Load type and weight are required for van/truck rides");
  }

  const customer = req.user;

  try {
    const distance = calculateDistance(pickupLat, pickupLon, dropLat, dropLon);
    const fare = calculateFare(distance, vehicle);

    const rideData = {
      vehicle,
      distance,
      fare: fare[vehicle],
      pickup: { address: pickupAddress, latitude: pickupLat, longitude: pickupLon },
      drop: { address: dropAddress, latitude: dropLat, longitude: dropLon },
      customer: customer.id,
      otp: generateOTP(),
      loadDetails: vehicle === "truck" || vehicle === "van" ? loadDetails : undefined,
      status: "SEARCHING_FOR_CAPTAIN",
      payment: {
        method: paymentMethod,
        amount: fare[vehicle],
        currency,
        status: paymentMethod === "cash" ? "unpaid" : "succeeded",
      },
    };

    if (paymentMethod === "card") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(fare[vehicle] * 100),
        currency,
        payment_method_types: ["card"],
      });
      rideData.payment.paymentIntentId = paymentIntent.id;
      rideData.payment.clientSecret = paymentIntent.client_secret;
    }

    const ride = new Ride(rideData);
    await ride.save();

    res.status(StatusCodes.CREATED).json({
      message: "Ride created successfully",
      ride,
      clientSecret: rideData.payment.clientSecret || null,
    });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Failed to create ride");
  }
};

const acceptRide = async (req, res) => {
  const captainId = req.user.id;
  const { rideId } = req.params;

  if (!rideId) {
    throw new BadRequestError("Ride ID is required");
  }

  try {
    let ride = await Ride.findById(rideId).populate("customer");

    if (!ride) {
      throw new NotFoundError("Ride not found");
    }

    if (ride.status !== "SEARCHING_FOR_CAPTAIN") {
      throw new BadRequestError("Ride is no longer available for assignment");
    }

    ride.captain = captainId;
    ride.status = "START";
    await ride.save();

    ride = await ride.populate("captain");

    req.socket.to(`ride_${rideId}`).emit("rideUpdate", ride);

    req.socket.to(`ride_${rideId}`).emit("rideAccepted");

    res.status(StatusCodes.OK).json({
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    console.error("Error accepting ride:", error);
    throw new BadRequestError("Failed to accept ride");
  }
};

const updateRideStatus = async (req, res) => {
  const { rideId } = req.params;
  const { status } = req.body;
  console.log("API Request:", rideId, status);
  if (!rideId || !status) {
    throw new BadRequestError("Ride ID and status are required");
  }

  try {
    let ride = await Ride.findById(rideId).populate("customer captain");

    if (!ride) {
      throw new NotFoundError("Ride not found");
    }


    if (!["START", "ARRIVED", "COMPLETED"].includes(status)) {
      throw new BadRequestError("Invalid ride status");
    }

    ride.status = status;
    await ride.save();

    req.socket.to(`ride_${rideId}`).emit("rideUpdate", ride);

    res.status(StatusCodes.OK).json({
      message: `Ride status updated to ${status}`,
      ride,
    });
  } catch (error) {
    console.error("Error updating ride status:", error);
    throw new BadRequestError("Failed to update ride status");
  }
};

// const getMyRides = async (req, res) => {
//   const userId = req.user.id;
//   const { status } = req.query;

//   try {
//     const query = {
//       $or: [{ customer: userId }, { captain: userId }],
//     };

//     if (status) {
//       query.status = status;
//     }

//     const rides = await Ride.find(query)
//       .populate("customer", "name phone")
//       .populate("captain", "name phone")
//       .sort({ createdAt: -1 });

//     res.status(StatusCodes.OK).json({
//       message: "Rides retrieved successfully",
//       count: rides.length,
//       rides,
//     });
//   } catch (error) {
//     console.error("Error retrieving rides:", error);
//     throw new BadRequestError("Failed to retrieve rides");
//   }
// };

// only show rides for the customer
// Controller function
const getMyRides = async (req, res) => {
  const userId = req.user.id; // Extracted from auth middleware (JWT)
  const status = req.query.status; // Optional query param to filter by status

  try {
    // Build query to fetch rides only for this customer and optionally by status
    const query = { customer: userId };
    if (status) {
      query.status = status;
    }

    // Find rides with full details populated
    const rides = await Ride.find(query)
      .populate("customer", "name phone")   // populate name and phone for customer
      .populate("captain", "name phone")    // populate name and phone for captain
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Rides retrieved successfully",
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("Error retrieving rides:", error);
    res.status(400).json({ message: "Failed to retrieve rides" });
  }
};


module.exports = { getMyRides };




const getAllRidesWithId = async (req, res) => {
  try {
    const rides = await Ride.find({}, "_id")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      message: "Ride IDs retrieved successfully",
      count: rides.length,
      rideIds: rides.map(ride => ride._id),
    });
  } catch (error) {
    console.error("Error retrieving ride IDs:", error);
    throw new BadRequestError("Failed to retrieve ride IDs");
  }
};

const submitRating = async (req, res) => {
  const { rating, review } = req.body; 
  const { id: rideId } = req.params;  
  const customerId = req.user.id;

  if (!rideId || !rating) {
    throw new BadRequestError("Ride ID and rating are required");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new BadRequestError("Ride not found");
  }

  if (ride.customer.toString() !== customerId) {
    throw new BadRequestError("You are not authorized to rate this ride");
  }

  if (ride.status !== "COMPLETED") {
    throw new BadRequestError("Cannot rate a ride that is not completed");
  }

  const existingRating = await Rating.findOne({ ride: rideId });

  if (existingRating) {
    throw new BadRequestError("Rating already submitted for this ride");
  }

  const newRating = new Rating({
    ride: rideId,
    customer: ride.customer,
    captain: ride.captain,
    rating,
    review,
  });

  await newRating.save();

  res.status(StatusCodes.CREATED).json({
    message: "Rating submitted successfully",
    rating: newRating,
  });
};



module.exports = { createRide, acceptRide, updateRideStatus, getMyRides,submitRating };
