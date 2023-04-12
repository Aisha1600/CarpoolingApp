const pool = require('../db.js');
const router = require('express').Router();
//const express = require("express");
//const router = express.Router();
const membercar_controller = require("../controllers/membercar_controller");

//not working
//router.post('/member/:member_id/addcar', membercar_controller.MemberCar);
router.post('/member/:member_id/car', membercar_controller.NewMemberCar);
router.post('/member/:member_id/car/:car_id', membercar_controller.updateCarMember);
router.post('/member/:member_id/car/updatem', membercar_controller.UpdateCarM);
router.get('/member/:member_id/car', membercar_controller.GetaCarMember);

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


