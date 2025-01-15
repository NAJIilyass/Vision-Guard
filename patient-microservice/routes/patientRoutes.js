const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
} = require("../controllers/patientController");

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.get("/", getAllPatients);
router.get("/:patientId", getPatientById);
router.post("/", createPatient);
router.patch("/:patientId", updatePatient);

module.exports = router;
