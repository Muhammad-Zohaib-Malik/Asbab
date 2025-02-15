const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const { uploadOnCloudinary, deleteImageFromCloudinary } = require("../utils/cloudinary");
const fs = require("fs");


const auth = async (req, res) => {
  const { phone, role } = req.body;

  if (!phone) {
    throw new BadRequestError("Phone number is required");
  }

  if (!role || !["customer", "captain"].includes(role)) {
    throw new BadRequestError("Valid role is required (customer or captain)");
  }

  try {
    let user = await User.findOne({ phone });

    if (user) {
      if (user.role !== role) {
        throw new BadRequestError("Phone number and role do not match");
      }

      const accessToken = user.createAccessToken();
      const refreshToken = user.createRefreshToken();

      return res.status(StatusCodes.OK).json({
        message: "User logged in successfully",
        user,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }

    user = new User({
      phone,
      role,
    });

    await user.save();

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error);
    throw error
  }
};

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    const newAccessToken = user.createAccessToken();
    const newRefreshToken = user.createRefreshToken();

    res.status(StatusCodes.OK).json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError("Invalid refresh token");
  }
};

const updateProfileController = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    throw new BadRequestError("Name is required to update profile");
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update the name only
    user.name = name;

    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Name updated successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        profilePic: user.profilePic,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateProfilePicContoller = async (req, res) => {
  const userId = req.user.id;
  const profilePic = req.file;

  if (!profilePic) {
    throw new BadRequestError("Profile picture is required");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.profilePicId) {
      try {
        await deleteImageFromCloudinary(user.profilePicId);
      } catch (error) {
        console.error('Error deleting existing profile picture:', error);
      }
    }

    try {
      const uploadResult = await uploadOnCloudinary(profilePic.path);
      if (!uploadResult) {
        throw new BadRequestError("Cloudinary upload returned undefined.");
      }

      const { secure_url, public_id } = uploadResult;
      user.profilePic = secure_url;
      user.profilePicId = public_id;
      fs.unlinkSync(profilePic.path);
    } catch (error) {
      console.error('Error uploading profile picture to Cloudinary:', error);
      throw new BadRequestError("Failed to upload profile Picture");

    }

    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Profile picture updated successfully",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        profilePic: user.profilePic,
        role: user.role,
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}




module.exports = {
  refreshToken,
  auth,
  updateProfileController,
  updateProfilePicContoller,

};
