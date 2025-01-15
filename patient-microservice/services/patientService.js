const mongoose = require("mongoose");
const PatientRepository = require("../repositories/patientRepository");

class PatientService {
    constructor() {
        this.patientRepository = new PatientRepository();
    }

    getAllPatients = async () => {
        return await this.patientRepository.getAllPatients();
    };

    getPatientById = async (patientId) => {
        if (!mongoose.Types.ObjectId.isValid(patientId))
            throw new Error("Invalid Object ID");

        const patient = await this.patientRepository.getPatientById(patientId);

        if (!patient) throw new Error("Patient not found");

        return patient;
    };

    createPatient = async (first_name, last_name, address, phone, email) => {
        if (!first_name || !last_name || !address || !phone || !email)
            throw new Error(
                "first_name, last_name, address, phone and email are all required"
            );

        const phoneRegex =
            /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Invalid phone number format");
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        return await this.patientRepository.createPatient({
            first_name,
            last_name,
            address,
            phone,
            email,
        });
    };

    updatedPatient = async (patientId, updatedPatient) => {
        if (!mongoose.Types.ObjectId.isValid(patientId))
            throw new Error("Invalid Object ID");

        if (!updatedPatient) throw new Error("Missing updated Object Data");

        if (
            updatedPatient.email &&
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                updatedPatient.email
            )
        ) {
            throw new Error("Invalid email format");
        }

        if (
            updatedPatient.phone &&
            !/^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/.test(
                updatedPatient.phone
            )
        ) {
            throw new Error("Invalid phone number format");
        }

        Object.keys(updatedPatient).forEach((key) => {
            if (updatedPatient[key] === "") {
                throw new Error(`${key} cannot be empty`);
            }
        });

        if (updatedPatient.createdAt) {
            delete updatedPatient.createdAt;
        }

        const updatedResult = await this.patientRepository.updatedPatient(
            clientId,
            updatedPatient
        );

        if (!updatedResult) throw new Error("Client not found");

        return updatedResult;
    };
}

module.exports = PatientService;
