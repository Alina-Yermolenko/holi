const mongoose = require("mongoose");

const TruckSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    // required: true,
    // unique: true,
    default: 'none',
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "IS"
  },
  createdDate: {
    type: String,
    default: new Date().toISOString(),
  },
});

module.exports = mongoose.model("Trucks", TruckSchema);
