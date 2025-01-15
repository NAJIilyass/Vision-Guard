const jwt = require("jsonwebtoken");
const validator = require("validator");
const userRepository = require("../repositories/userRepository");

// Create a token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const login = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password must be provided.");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
    }

    // Check email & password
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new Error("Incorrect email or password.");
    }

    const isMatch = await userRepository.comparePassword(
        password,
        user.password
    );
    if (!isMatch) {
        throw new Error("Incorrect email or password.");
    }

    const token = createToken(user._id);
    return token;
};

// Signup user
const signup = async (email, password) => {
    if (!email || !password) {
        throw new Error("Email and password must be provided.");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error(
            "Password must be strong (include uppercase, numbers, and symbols)."
        );
    }

    // Check if email already exists
    const isTaken = await userRepository.isEmailTaken(email);
    if (isTaken) {
        throw new Error("Email already in use.");
    }

    const user = await userRepository.signup(email, password);

    const token = createToken(user._id);
    return token;
};

// Validate token
const validateToken = async (token) => {
    if (!token) {
        throw new Error("Token is required.");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return { id: decoded._id };
    } catch (err) {
        throw new Error("Invalid token.");
    }
};

module.exports = { login, signup, validateToken };
