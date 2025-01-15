const PatientService = require("../services/patientService");

const patientService = new PatientService();

getAllPatients = async (req, res) => {
    try {
        const response = await patientService.getAllPatients();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

getPatientById = async (req, res) => {
    const { patientId } = req.params;

    try {
        const response = await patientService.getPatientById(patientId);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("Invalid"))
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

createPatient = async (req, res) => {
    const { first_name, last_name, address, phone, email } = req.body;

    try {
        const response = await patientService.createPatient(
            first_name,
            last_name,
            address,
            phone,
            email
        );
        res.status(201).json(response);
    } catch (err) {
        console.error(err);

        if (err.message.includes("required") || err.message.includes("format"))
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

updatePatient = async (req, res) => {
    const { patientId } = req.params;
    const { first_name, last_name, address, phone, email } = req.body;

    const updatedPatient = {};
    if (first_name) updatedPatient.first_name = first_name;
    if (last_name) updatedPatient.last_name = last_name;
    if (address) updatedPatient.address = address;
    if (phone) updatedPatient.phone = phone;
    if (email) updatedPatient.email = email;

    try {
        const response = await patientService.updatePatient(
            patientId,
            updatedPatient
        );
        res.status(200).json(response);
    } catch (err) {
        console.error(err);

        if (
            err.message.includes("Invalid") ||
            err.message.includes("Missing") ||
            err.message.includes("empty")
        )
            res.status(400).json({ error: err.message });
        else if (err.message.includes("not found"))
            res.status(404).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
};
