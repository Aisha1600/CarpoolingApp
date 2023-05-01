const pool = require('../db.js');
const router = require('express').Router();
//const express = require("express");
//const router = express.Router();
const membercar_controller = require("../controllers/membercar_controller");

//router.post('/member/:member_id/addcar', membercar_controller.MemberCar);
router.post('/InsertCar', membercar_controller.InsertCarDetails);
router.post('/member/:member_id/car/:car_id', membercar_controller.updateCarMember);
router.get('/getAllCarsOfMember', membercar_controller.getAllCarsOfMember);
router.get('/getMemberCarId', membercar_controller.getMemberCarId);
router.get('/member/:member_id/car/allcars', membercar_controller.getAllCarsOfMember);
router.delete('/DeleteDetails', membercar_controller.DeleteDetails);


module.exports= router;


