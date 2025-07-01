// models/Ride.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rideSchema = new Schema(
  {
    vehicle: {
      type: String,
      enum: ["bike", "auto", "cabEconomy", "cabPremium", "truck", "van"],
      required: true,
    },
    distance: { type: Number, required: true },
    pickup: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    drop: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    loadDetails: {
      type: {
        type: String,
        default: null,
      },
      weight: {
        type: Number,
        default: null,
      },
    },
    fare: { type: Number, required: true },
    payment: {
      method: {
        type: String,
        enum: ["cash", "card"],
      },
      paymentIntentId: { type: String, default: null },
      currency: { type: String, default: "pkr" },
      status: {
        type: String,
        enum: ["pending", "succeeded", "failed", "unpaid", null],
        default: null,
      },
      amount: { type: Number, default: null },
    },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    captain: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["SEARCHING_FOR_CAPTAIN", "START", "ARRIVED", "COMPLETED"],
      default: "SEARCHING_FOR_CAPTAIN",
    },
    otp: { type: String, default: null },
  },
  { timestamps: true },
);

const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
