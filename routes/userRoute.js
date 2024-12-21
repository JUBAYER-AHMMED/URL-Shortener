const express = require("express");
const {
  handleUserSignUp,
  handlelogin,
} = require("../controllers/user_controller");
const router = express.Router();
router.post("/", handleUserSignUp);
router.post("/login", handlelogin);

module.exports = router;
