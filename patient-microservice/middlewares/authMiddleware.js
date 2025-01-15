const axios = require("axios");
require("dotenv").config();

const { AUTHENTICATION_API_URL } = process.env;

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from Authorization header

    if (!token) {
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
    }

    try {
        // Validate the token with the Authentication microservice
        const response = await axios.post(
            `${AUTHENTICATION_API_URL}/validate-token`,
            {
                token,
            }
        );

        // Attach user info to request object if token is valid
        req.user = response.data.user;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ error: "Invalid token or unauthorized access." });
    }
};

module.exports = authMiddleware;
