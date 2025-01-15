const axios = require("axios");
const amqp = require("amqplib");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

class PatientService {
    constructor() {
        this.channel = null;
        this.connectRabbitMQ();
    }

    async connectRabbitMQ(retries = 5, delay = 10000) {
        while (retries > 0) {
            try {
                const amqpServer = process.env.RABBITMQ_URL;
                const connection = await amqp.connect(amqpServer);
                this.channel = await connection.createChannel();
                await this.channel.assertQueue("NOTIFICATIONS");
                console.log("RabbitMQ connected and queue asserted");
                return;
            } catch (error) {
                console.error("Failed to connect to RabbitMQ:", error.message);
                retries -= 1;
                if (retries === 0) {
                    throw new Error("Could not connect to RabbitMQ");
                }
                console.log(`Retrying... (${retries} retries left)`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    async saveImage(fundusImage) {
        try {
            const sharedDir = path.join(__dirname, "../shared");
            if (!fs.existsSync(sharedDir)) {
                fs.mkdirSync(sharedDir, { recursive: true });
            }
            const filePath = path.join(sharedDir, fundusImage.originalname);
            fs.writeFileSync(filePath, fundusImage.buffer);
            return filePath; // Return the path for further processing
        } catch (error) {
            console.error("Error saving image:", error.message);
            throw new Error("Failed to save image");
        }
    }

    publishNotification(channel, email, patientName, predictionResult) {
        if (channel) {
            const message = {
                email,
                subject: "Vision Guard: Eye Disease Prediction Result",
                text: `Dear ${patientName},\n\nWe are pleased to inform you that your recent eye disease prediction results are ready. Below are the details:\n\nPrediction Result: ${predictionResult.toFixed(
                    2
                )}% likelihood of potential eye conditions.\n\nPlease consult with a medical professional for further evaluation and diagnosis.\n\nThank you for trusting Vision Guard!\n\nBest regards,\nThe Vision Guard Team`,
            };

            channel.sendToQueue(
                "NOTIFICATIONS",
                Buffer.from(JSON.stringify(message))
            );
            console.log("Notification message published to RabbitMQ queue");
        } else {
            console.warn(
                "RabbitMQ channel not available. Notification not sent."
            );
        }
    }

    async predictPatient(patientDetails, fundusImage, token) {
        const { first_name, last_name, email, phone, address } = patientDetails;

        try {
            // Save image and get its path
            const filePath = await this.saveImage(fundusImage);

            // Create patient in patient-microservice
            const patientResponse = await axios.post(
                `${process.env.PATIENT_API_URL}`,
                {
                    first_name,
                    last_name,
                    email,
                    phone,
                    address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Send the file path to the model-microservice for prediction
            const modelResponse = await axios.post(
                `${process.env.MODEL_API_URL}/predict`,
                { path: filePath },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            this.publishNotification(
                this.channel,
                email,
                `${first_name} ${last_name}`,
                modelResponse.data.prediction
            );

            return modelResponse.data; // Return prediction response
        } catch (error) {
            console.error(
                "Error in PatientService.predictPatient:",
                error.message
            );
            throw new Error(
                "An error occurred while processing the patient prediction."
            );
        }
    }
}

module.exports = new PatientService();
