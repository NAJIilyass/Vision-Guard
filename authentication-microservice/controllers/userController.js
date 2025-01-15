const userService = require("../services/userService");
require("dotenv").config();

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await userService.login(email, password);
        res.status(200).json({ email, token });
    } catch (err) {
        console.error(err);
        if (err.message.includes("Invalid") || err.message.includes("provided"))
            res.status(400).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

// Signup user
const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await userService.signup(email, password);
        res.status(200).json({ email, token });
    } catch (err) {
        console.error(err);
        if (
            err.message.includes("Invalid") ||
            err.message.includes("provided") ||
            err.message.includes("must be")
        )
            res.status(400).json({ error: err.message });
        else if (err.message.includes("in use"))
            res.status(409).json({ error: err.message });
        else res.status(500).json({ error: err.message });
    }
};

// Validate token
const validateToken = async (req, res) => {
    console.log("arrive");
    const { token } = req.body;

    try {
        const user = await userService.validateToken(token);
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid token." });
    }
};

module.exports = { loginUser, signupUser, validateToken };
