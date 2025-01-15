const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/login", userController.loginUser);
router.post("/signup", userController.signupUser);
router.post("/validate-token", userController.validateToken);

module.exports = router;
