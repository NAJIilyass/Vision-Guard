require("dotenv").config();

const { PATIENT_API_URL, AUTHENTICATION_API_URL, MODEL_API_URL } = process.env;

const getProxyOptions = (service) => {
    let target;

    switch (service) {
        case "AUTHENTICATION":
            target = AUTHENTICATION_API_URL;
            break;
        case "PATIENT":
            target = PATIENT_API_URL;
            break;
        case "MODEL":
            target = MODEL_API_URL;
            break;
        default:
            throw new Error("Service not found");
    }

    return {
        target,
        changeOrigin: true,
    };
};

module.exports = {
    getProxyOptions,
};
