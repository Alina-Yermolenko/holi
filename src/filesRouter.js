const express = require('express');
const router = express.Router();

const { getUser, deleteUser, changeUserPassword } = require("./controllers/user");
const { getTrucks, createTruck, getTruckById, updateTruckById, deleteTruckById, asignTruckById } = require("./controllers/trucks");
const { registerUser, loginUser, forgotPasswordUser } = require("./controllers/auth");

const { createLoad, getLoads, getActiveLoads, deleteLoadById, postLoad, updateLoadById, getLoadById, changeLoadState, getShippingInfo } = require("./controllers/loads");



router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgot_password', forgotPasswordUser);

router.get('/users/me', getUser);
router.delete('/users/me', deleteUser);
router.patch('/users/me', changeUserPassword);


///only for driver
router.get('/trucks', getTrucks);
router.post('/trucks', createTruck);
router.get('/trucks/:id', getTruckById);
router.put('/trucks/:id', updateTruckById);
router.delete('/trucks/:id', deleteTruckById);
router.post('/trucks/:id/assign', asignTruckById);
//


router.get('/loads', getLoads);//shipper and driver
router.post('/loads', createLoad);//shipper
router.get('/loads/active', getActiveLoads);//driver
router.patch('/loads/active/state', changeLoadState);//driver
router.get('/loads/:id', getLoadById);//shipper and driver
router.put('/loads/:id', updateLoadById);//shipper
router.delete('/loads/:id', deleteLoadById);//shipper
router.post('/loads/:id/post', postLoad);//shipper
router.get('/loads/:id/shipping_info', getShippingInfo);//shipper



module.exports = {
  filesRouter: router
};
