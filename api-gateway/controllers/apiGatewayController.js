const { createProxyMiddleware } = require("http-proxy-middleware");
const { getProxyOptions } = require("../services/proxyService");
const patientService = require("../services/patientService");

const proxyRequest = (service) => {
    return createProxyMiddleware(getProxyOptions(service));
};

const predictPatient = async (req, res) => {
    const { first_name, last_name, email, phone, address } = req.body;
    const fundusImage = req.file;
    const token = req.headers.authorization?.split(" ")[1];

    if (!fundusImage) {
        return res.status(400).json({ error: "Fundus image is required." });
    }

    try {
        const response = await patientService.predictPatient(
            { first_name, last_name, email, phone, address },
            fundusImage, // Pass the image as it is
            token
        );

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in predict-a-patient:", error.message);
        res.status(500).json({
            error: "An error occurred while processing the request.",
        });
    }
};

module.exports = {
    proxyRequest,
    predictPatient,
};
