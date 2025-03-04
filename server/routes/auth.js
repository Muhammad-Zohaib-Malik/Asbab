const express = require("express");
const router = express.Router();
const { refreshToken, auth, updateProfileController, updateProfilePicContoller } = require("../controllers/auth");
const verifyJWT = require("../middleware/authentication");
const { upload } = require("../middleware/multer");

router.post("/refresh-token", refreshToken);
router.post("/signin", auth);
router.put("/update-profile", verifyJWT, updateProfileController)
router.put("/update-profile-pic", verifyJWT, upload.single('profilePic'), updateProfilePicContoller)


module.exports = router;
