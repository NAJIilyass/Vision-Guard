const Patient = require("../Models/patientModel");

class PatientRepository {
    getAllPatients = async () => {
        try {
            const response = await Patient.find({}).sort({ createdAt: -1 });
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    getPatientById = async (patientId) => {
        try {
            const response = await Patient.findById(patientId);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    createPatient = async (createdPatient) => {
        try {
            const response = await Patient.create(createdPatient);
            return response;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    updatePatient = async (patientId, updatedPatient) => {
        try {
            const response = await Patient.findByIdAndUpdate(
                patientId,
                updatedPatient,
                {
                    new: true,
                }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}

module.exports = PatientRepository;
