const express = require("express");
const router = express.Router();

const { createComplaint, getComplaintsById } = require("../controllers/complain");
const verifyJWT = require("../middleware/authentication");

router.post("/", verifyJWT, createComplaint);
router.get("/:userId", verifyJWT, getComplaintsById);

module.exports = router;