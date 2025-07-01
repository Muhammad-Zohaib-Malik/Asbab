const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["customer", "captain"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    name: {
      type: String,
      minlength: 3,
      maxLength: 50,
      trim: true,
    },
    profilePic: {
      type: String,
    },
    profilePicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      phone: this.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { id: this._id, phone: this.phone },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
