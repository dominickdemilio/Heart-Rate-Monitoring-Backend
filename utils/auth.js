const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key'; // TODO: Replace with a secure key?

// Generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h',
    });
};

// Middleware, authenticates the JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Why split?
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

module.exports = { generateToken, authenticateToken };
