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




//router.put('/member/:member_id/car/:car_id', membercar_controller.updateCarMember);
//router.post('/InsertCarDetails', membercar_controller.InsertCarDetails)
//router.get('/GetCarMember', membercar_controller.GetCarMember)
//router.delete('/DeleteCarReg', membercar_controller.DeleteCarReg)
//router.put('/UpdateCarM', membercar_controller.UpdateCarM)

//router.delete('/DeleteCarColor', membercar_controller.DeleteCarColor)
//router.delete('/DeleteCarDetails', membercar_controller.DeleteCarDetails)

//router.get('/GetAllDetails', membercar_controller.GetAllDetails)
//router.get('/GetCarDetails', membercar_controller.GetCarDetails)



module.exports= router;


