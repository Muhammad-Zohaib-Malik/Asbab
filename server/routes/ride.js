const express = require("express");
const {
  createRide,
  updateRideStatus,
  acceptRide,
  getMyRides,
  submitRating,
} = require("../controllers/ride");

const router = express.Router();

router.use((req, res, next) => {
  req.io = req.app.get("io");
  next();
});

router.post("/create", createRide);
router.patch("/accept/:rideId", acceptRide);
router.patch("/update/:rideId", updateRideStatus);
router.get("/rides", getMyRides);
router.post("/rating/:id", submitRating);



module.exports = router;
