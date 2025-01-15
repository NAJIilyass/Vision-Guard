const express = require("express");
const multer = require("multer");
const {
    proxyRequest,
    predictPatient,
} = require("../controllers/apiGatewayController");

const router = express.Router();
const upload = multer();

router.use("/auth", proxyRequest("AUTHENTICATION"));
router.use("/patients", proxyRequest("PATIENT"));
router.use("/model", proxyRequest("MODEL"));
router.post("/predict-a-patient", upload.single("fundusImage"), predictPatient);

module.exports = router;
