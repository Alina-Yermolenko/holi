const mongoose = require("mongoose")

let loadSchema = mongoose.Schema({
  loadId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    required: true,
    default: "NEW"
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  payload: {
    type: Number,
    // required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      default: 10,
    },
    length: {
      type: Number,
      default: 10,
    },
    height: {
      type: Number,
      default: 10,
    },
  },
  logs: [{
    message: {
      type: String,
    },
    time: {
      type: String,
    },
  }],
  created_date: {
    type: String,
    default: new Date().toISOString(),
  },

});


module.exports = mongoose.model("Loads", loadSchema);
