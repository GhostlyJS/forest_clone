const jsonwebtoken = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'forest';


const jwtMiddleware = (req, res, next) => {
    // Bearer token extraction
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Token verification
    jsonwebtoken.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

module.exports = jwtMiddleware;