const Truck = require("../models/truckModel");
const Load = require("../models/loadModel");
const User = require("../models/userModel");


const { ObjectID } = require("bson");

const getTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ userId: req.user.userId })
    if (req.user.role.toLowerCase() === "driver") {
      return res.status(200).json(
        {
          trucks: trucks
        }
      )
    } else {
      return res.status(400).json({ message: "Shipper can't have cars" });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

const createTruck = async (req, res) => {
  let user = await User.findOne({ "_id": ObjectID(req.user.userId) });
  let driver = req.user.role.toLowerCase() === "driver";

  const { type } = req.body;
  if (user && driver) {
    let userTruck = new Truck({
      _id: user.userId,
      userId: user._id,
      created_by: user._id,
      type: type,
      createdDate: new Date().toISOString(),
    });


    return userTruck.save()
      .then(saved => console.log(saved))
      .then(
        res.status(200).send({ "message": `Success` })
      )
      .catch(err => {
        console.log(err)
      })
  }
  if (!user) {
    res.status(400).send({ "message": `User doesn't exist` })
  } else {
    res.status(500).send({ "message": `server error` })
  }
}

const getTruckById = async (req, res) => {
  try {
    let truck = await Truck.findOne({ "_id": ObjectID(req.params.id) });
    let driver = req.user.role.toLowerCase() === "driver";

    if (truck && driver) {
      res.status(200).send({
        truck: truck,
      })
    }
    if (!truck) {
      res.status(400).send({ "message": `Truck doesn't exist` })
    }
  } catch (err) {
    res.status(500).send({ "message": `server error` })
  }
}

const updateTruckById = async (req, res) => {
  try {
    let driver = req.user.role.toLowerCase() === "driver";

    if (req.body.type.length <= 0) {
      return res.status(400).json({ 'message': 'No type' });
    }
    if (driver && req.body.type.length > 0) {
      await Truck.findOneAndUpdate({ "_id": ObjectID(req.params.id) }, { "type": req.body.type });
      return res.status(200).json({ 'message': 'Truck details changed successfully' })
    }
    if (req.body.type.toLowerCase() !== "sprinter" ||
      req.body.type.toLowerCase() !== "small straight" ||
      req.body.type.toLowerCase() !== "large straight") {
      return res.status(400).json({ 'message': 'Wrong type' });
    }
  } catch (err) {
    return res.status(500).json({ 'message': 'Error' });
  }

}

const deleteTruckById = async (req, res) => {
  try {
    let truck = await Truck.collection.deleteOne({ "_id": ObjectID(req.params.id) });
    let driver = req.user.role.toLowerCase() === "driver";

    if (truck && driver) {
      return res.status(200).send({ "message": "Truck deleted successfully" })
    }
    if (!truck) {
      return res.status(400).send({ "message": `Truck doesn't exist` })
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

const asignTruckById = async (req, res) => {
  try {
    let truck = await Truck.findOne({ "_id": ObjectID(req.params.id) });
    let driver = req.user.role.toLowerCase() === "driver";

    let assignedNow = await Truck.findOne({ "assigned_to": req.user.userId });
    if (String(req.user.userId) === truck.created_by) {
      if (assignedNow) {
        await assignedNow.updateOne({ "assigned_to": 'none' })
      }
      if (truck && driver) {
        let updatedTruck = await truck.updateOne({ "assigned_to": req.user.userId });
        return res.status(200).json({ 'message': 'Successfully changed' })
      }
      if (!truck) {
        return res.status(400).json({ 'message': 'No such truck' });
      }
      if (!changedTruck) {
        return res.status(400).json({ 'message': 'User not changed' });
      }
    } else {
      return res.status(400).json({ 'message': 'An error occured' });
    }
  } catch (err) {
    return res.status(400).json({ 'message': 'Error' });
  }
}


module.exports = {
  getTrucks,
  createTruck,
  getTruckById,
  updateTruckById,
  deleteTruckById,
  asignTruckById
};