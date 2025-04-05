const express = require("express");
const { handleLogin, handleSignup, handleLoginEmployer, handleadminLogin, handleGetalluser, handleBlockUser } = require("../controller/userController");
const { protect, Admin } = require("../middleware/authMiddleware");
const router = express.Router();


router.route("/v1/signup").post(handleSignup);
router.route("/v1/login").post(handleLogin);
router.route("/v1/loginemployer").post(handleLoginEmployer);
router.route("/v1/loginadmin").post(handleadminLogin);
router.route("/v1/getalluser").get(protect, Admin, handleGetalluser);
router.route("/v1/blockuser/:id").put(protect, Admin, handleBlockUser);

module.exports = router;