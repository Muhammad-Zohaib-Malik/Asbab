const express = require("express");
const router = express.Router();

const { createComplaint, getComplaintsById } = require("../controllers/complain");

router.post("/", createComplaint);
router.get("/:userId", getComplaintsById);

module.exports = router;