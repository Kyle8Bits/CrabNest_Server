// middleware/auth.js
function authMiddleware(req, res, next) {
    const token = req.header('Authorization');
     console.log('Authorization token:', token); 
    if (token === 'pass') { // Simplified token check for demonstration
        console.log('User is authenticated');
        next();
    } else {
        console.log('User is not authenticated');
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = authMiddleware;
