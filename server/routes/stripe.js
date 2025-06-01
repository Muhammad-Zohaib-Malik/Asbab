const express= require("express");
const { createStripe } = require("../controllers/stripe");
const router = express.Router();

router.post("/create-stripe", createStripe);

module.exports = router;
