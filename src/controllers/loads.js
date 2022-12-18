const Load = require("../models/loadModel");
const User = require("../models/userModel");
const Truck = require("../models/truckModel");

const { ObjectID } = require("bson");

const SPRINTER = {
  name: 'SPRINTER',
  width: 300,
  length: 250,
  height: 170,
  capacity: 1700,
};
const SMALL_STRAIGHT = {
  name: 'SMALL STRAIGHT',
  width: 500,
  length: 250,
  height: 170,
  capacity: 2500,
};

const LARGE_STRAIGHT = {
  name: 'LARGE STRAIGHT',
  width: 700,
  length: 350,
  height: 0,
  capacity: 4000,
};

function getType(type) {
  switch (type) {
    case 'SPRINTER':
      return SPRINTER;
    case 'SMALL STRAIGHT':
      return SMALL_STRAIGHT;
    case 'LARGE STRAIGHT':
      return LARGE_STRAIGHT;
  }
}

const getLoads = async (req, res) => {
  if (req.query.offset === undefined) {
    req.query.offset = 0 || +req.query.offset;
  }
  if (req.query.limit === undefined) {
    req.query.limit = 10 || +req.query.limit;
  }
  try {
    if (req.user.role.toLowerCase() === 'shipper') {
      const loadsOfShipper = await Load.find({ created_by: req.user.userId })
      return res.status(200).json(
        {
          offset: req.query.offset !== undefined ? +req.query.offset : undefined,
          limit: req.query.limit !== undefined ? +req.query.limit : undefined,
          loads: loadsOfShipper
        }
      )
    }
    if (req.user.role.toLowerCase() === 'driver') {
      let trucks = await Truck.find({ "created_by": req.user.userId });

      for (let truck of trucks) {
        const loadsOfDriver = await Load.find({ 'assigned_to': ObjectID(truck._id) });
        return res.status(200).json(
          {
            offset: req.query.offset !== undefined ? +req.query.offset : undefined,
            limit: req.query.limit !== undefined ? +req.query.limit : undefined,
            loads: loadsOfDriver
          }
        )
      }
    }
    else {
      return res.status(400).json({ message: "No loads" });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

const createLoad = async (req, res) => {
  try {
    let user = await User.findOne({ "_id": ObjectID(req.user.userId) });
    let shipper = req.user.role.toLowerCase() === "shipper";
    const { name, payload, pickup_address, delivery_address, dimensions } = req.body;
    if (user && shipper) {
      let userLoad = new Load({
        _id: user.loadId,
        userId: user._id,
        created_by: user._id,
        name,
        payload,
        pickup_address,
        delivery_address,
        dimensions: {
          width: dimensions.width,
          length: dimensions.length,
          height: dimensions.height,
        },
        createdDate: new Date().toISOString(),
      });


      return userLoad.save()
        .then(saved => console.log(saved))
        .then(
          res.status(200).send({ "message": `Load created successfully` })
        )
        .catch(err => {
          console.log(err)
        })
    }
    if (!user) {
      return res.status(400).send({ "message": `User doesn't exist` })
    }
    if (!shipper) {
      return res.status(400).send({ "message": `Driver can't create loads` })
    }
    // if (!req.body) {
    //   return  res.status(400).send({ "message": `Please, fill all the data` })
    // }
    if (allDrivers.length <= 0) {
      return res.status(400).send({ "message": `Drivers not avaliable` })
    }
  }
  catch (err) {
    console.error(err);
    return res.status(500).send({ "message": `server error` })
  }
}

const getActiveLoads = async (req, res) => {
  try {
    let driver = req.user.role.toLowerCase() === "driver";
    let trucks = await Truck.find({ "created_by": req.user.userId });

    for (let truck of trucks) {
      if (driver) {
        let postedLoads = await Load.findOne({
          'assigned_to': ObjectID(truck._id),
          status: "ASSIGNED"
        })
        console.log(postedLoads)
        return res.status(200).send({
          "load": {
            _id: postedLoads._id,
            created_by: postedLoads.created_by,
            assigned_to: postedLoads.assigned_to,
            status: postedLoads.status,
            state: postedLoads.state,
            name: postedLoads.name,
            payload: postedLoads.payload,
            pickup_address: postedLoads.pickup_address,
            delivery_address: postedLoads.delivery_address,
            dimensions: postedLoads.dimensions,
            logs: postedLoads.logs,
            created_date: postedLoads.created_date,
          },
        })
      }
      else {
        return res.status(400).send({ "message": `No active loads` })
      }
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

const changeLoadState = async (req, res) => {
  try {
    let user = await User.findOne({ "_id": ObjectID(req.user.userId) });
    // let driverTruck = await Truck.findOne({ "assigned_to": ObjectID(req.user.userId), assigned_to: });
    let driver = req.user.role.toLowerCase() === "driver";
    const assignedLoad = await Load.findOne({ status: "ASSIGNED" })
    const truck = await Truck.findOne({ "_id": assignedLoad.assigned_to })
    if (driver) {
      if (assignedLoad.state === "En route to Pick Up") {
        await assignedLoad.updateOne({
          $set: {
            "state": "Arrived to Pick Up"
          }
        });
        return res.status(200).send({
          "message": `Load state changed to '${assignedLoad.state}'`
        })
      }
      if (assignedLoad.state === "Arrived to Pick Up") {
        await assignedLoad.updateOne({
          $set: { "state": "En route to delivery" }
        });
        return res.status(200).send({
          "message": `Load state changed to '${assignedLoad.state}'`
        })
      }
      if (assignedLoad.state === "En route to delivery") {
        await assignedLoad.updateOne({
          $set: {
            "state": "Arrived to delivery",
            "status": "SHIPPED"
          }
        });
        await truck.updateOne({ $set: { "status": "IS" } });
        return res.status(200).send({
          "message": `Load state changed to '${assignedLoad.state}'`
        })
      }
    }
    else {
      return res.status(400).send({ "message": `Assigned load not found` })
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

const getLoadById = async (req, res) => {
  try {
    let load = await Load.findOne({ "_id": ObjectID(req.params.id) });
    if (load) {
      return res.status(200).send({
        "load": load,
      })
    }
    else {
      return res.status(400).send({ "message": `Load doesn't exist` })
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

const updateLoadById = async (req, res) => {
  try {
    let load = await Load.findOne({ "_id": ObjectID(req.params.id) });
    let shipper = req.user.role.toLowerCase() === "shipper";
    if (load.status === "NEW" && shipper) {
      await load.updateOne({
        $set: {
          "name": req.body.name,
          "payload": req.body.payload,
          "pickup_address": req.body.pickup_address,
          "delivery_address": req.body.delivery_address,
          "dimensions.width: ": req.body.dimensions.width,
          "dimensions.length": req.body.dimensions.length,
          "dimensions.height": req.body.dimensions.height,
        }
      })
      return res.status(200).send({
        "message": "Load details changed successfully",
      })
    }
    else {
      return res.status(400).send({ "message": `Load not changed` })
    }
  }
  catch (err) {
    console.error(err)
    return res.status(500).send({ "message": `server error` })
  }
}

const deleteLoadById = async (req, res) => {
  try {
    let load = await Load.collection.deleteOne({ "_id": ObjectID(req.params.id) });
    let shipper = req.user.role.toLowerCase() === "shipper";
    if (load && shipper) {
      return res.status(200).send({ "message": "Successfully deleted load" })
    }
    if (!load) {
      return res.status(400).send({ "message": `Load doesn't exist` })
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

const postLoad = async (req, res) => {
  try {
    let user = await User.findOne({ "_id": ObjectID(req.user.userId) });
    let shipper = req.user.role.toLowerCase() === "shipper";

    if (user && shipper) {
      let load = await Load.findOneAndUpdate({ "_id": ObjectID(req.params.id) }, {
        "status": "POSTED",
      });
      let avaliableTruck = await Truck.find({ "status": "IS" });
      let truckWithDriver = avaliableTruck.find(truck => truck.assigned_to !== "none")

      if (truckWithDriver && load.status !== "SHIPPED") {
        await Load.findOneAndUpdate({ "_id": ObjectID(req.params.id) }, {
          "status": "ASSIGNED",
          "state": "En route to Pick Up",
          "assigned_to": truckWithDriver._id,
          "logs": [{
            "message": `Load assigned to driver with id ${avaliableTruck[0].created_by}`,
            "time": new Date().toISOString()
          }]
        });
        await truckWithDriver.updateOne({ $set: { "status": "OL" } });
        return res.status(200).send({
          "message": "Load posted successfully",
          "driver_found": true
        })
      }

      if (truckWithDriver === undefined && load.status !== "SHIPPED") {
        await Load.findOneAndUpdate({ "_id": ObjectID(req.params.id) }, {
          "status": "NEW",
        });
        return res.status(200).send({
          "message": "Load posted successfully",
          "driver_found": false,
        });
      }

      if (load.status === "SHIPPED") {
        await Load.findOneAndUpdate({ "_id": ObjectID(req.params.id) }, {
          "status": "SHIPPED",
        });
        return res.status(400).send({ "message": `Load not posted` })
      }

      else {
        await Load.findOneAndUpdate({ "_id": ObjectID(req.params.id) }, {
          "status": "NEW",
        });
        return res.status(400).send({ "message": `Load not posted` })

      }
    }
    else {
      return res.status(400).send({ "message": `Load doesn't exist` })
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

const getShippingInfo = async (req, res) => {
  try {
    let shipper = req.user.role.toLowerCase() === "shipper";
    if (shipper) {
      let load = await Load.findOne({ "_id": ObjectID(req.params.id) });
      let truck = await Truck.findOne({ "_id": ObjectID(load.assigned_to) });
      if (load) {
        return res.status(200).send({
          "load": load,
          "truck": truck
        })
      }
      else {
        return res.status(400).send({ "message": `Load doesn't exist` })
      }
    }
  }
  catch (err) {
    return res.status(500).send({ "message": `server error` })
  }
}

module.exports = {
  getLoads,
  createLoad,
  getActiveLoads,
  changeLoadState,
  postLoad,
  getLoadById,
  updateLoadById,
  deleteLoadById,
  getShippingInfo
};
