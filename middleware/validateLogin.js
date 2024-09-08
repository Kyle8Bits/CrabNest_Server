// middleware/validateLogin.js
function validateLoginData(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        console.log('No username + password')
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (password.length < 6) {
        console.log("Password not enough length")
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    console.log("valid password + username");
    next();
}

module.exports = validateLoginData;
