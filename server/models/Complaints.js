const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complainSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complain", complainSchema);
