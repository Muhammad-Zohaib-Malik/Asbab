const express = require("express");
const router = express.Router();
const { refreshToken, auth, updateProfileController } = require("../controllers/auth");
const verifyJWT = require("../middleware/authentication");

router.post("/refresh-token", refreshToken);
router.post("/signin", auth);
router.put("/update-profile", verifyJWT, updateProfileController)
module.exports = router;
