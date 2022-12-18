const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {

    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ "message": "Invalid name or password" });
    } 
    if (req.body.role.toLowerCase() !== 'shipper' && req.body.role.toLowerCase() !== 'driver') {
      return res.status(400).send({ "message": `No such role` })
    }

    let userData = new User({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      role: req.body.role,
    });

    await userData.save()
    return res.status(200).send({ "message": `Profile created successfully` })
  }

  catch (err) {
    console.error(err)
    return res.status(500).send({ "message": "Server error" })
  }

}

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user && await bcrypt.compare(String(req.body.password), String(user.password))) {
      const payload = {
        _id: user._id,
        role: user.role,
      }
      

      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      const jwtToken = jwt.sign(payload, jwtSecretKey);
      if(jwtToken === undefined){
        jwtToken = "No token provided"
      }
      return res.status(200).json({ "jwt_token": jwtToken });
    }
    else {
      return res.status(400).json({ 'message': 'Not authorized' });
    }
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ 'message': 'Server error' });
  }
}

const forgotPasswordUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(200).json({ 'message': 'New password sent to your email address' });
    }
    else {
      return res.status(400).json({ 'message': 'Wrong email' });
    }
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({ 'message': 'Server error' });
  }
}

module.exports = {
  loginUser,
  registerUser,
  forgotPasswordUser
};