const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split(' ')[1];
      if (!token) {
        next()
      }

      const tokenPayLoad = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const currentUser = await User.findById(tokenPayLoad._id);

      req.user = {
        userId: currentUser._id,
        email: currentUser.email,
        role: currentUser.role,
      }
    }
    next();
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  authMiddleware
}
