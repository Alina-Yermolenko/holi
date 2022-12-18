const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// const jwt = require('jsonwebtoken');
const { ObjectID } = require("bson");

const getUser = async (req, res) => {
  try {
    if(!req.user){
      return res.status(401).json({ 'message': 'Please, include token to request' });
    }
    let user = await User.findOne({ "_id": ObjectID(req.user.userId) });
    if (user) {
      return res.status(200).json({
        "user": {
          "_id": user._id,
          "role": user.role,
          "email": user.email,
          "created_date": user.createdDate,
        }
      });
    }
    else {
      return res.status(400).json({ 'message': 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ 'message': 'Server error' });
  }

};

const deleteUser = async (req, res) => {
  let user = await User.collection.deleteOne({ "_id": ObjectID(req.user.userId) })
  if (user) {
    return res.status(200).json({
      "message": "Profile deleted successfully",
    });
  }
  if (!user) {
    return res.status(400).json({ 'message': 'Bad request' });
  } else {
    return res.status(500).json({ 'message': 'Server error' });
  }
};

const changeUserPassword = async (req, res) => {
  let currentUser = await User.findOne({ "_id": ObjectID(req.user.userId) });
  if (await bcrypt.compare(String(req.body.oldPassword), String(currentUser.password))) {

    await User.updateOne(
      { "_id": ObjectID(req.user.userId) },
      { password: await bcrypt.hash(req.body.newPassword, 10) }
    );

    return res.status(200).json({ 'message': 'Password changed successfully' })
  }
  if (!req.body.newPassword) {
    return res.status(400).json({ 'message': 'Write a new password' });
  } else {
    return res.status(400).json({ 'message': 'Wrong password' });
  }
};

module.exports = {
  getUser,
  deleteUser,
  changeUserPassword
};