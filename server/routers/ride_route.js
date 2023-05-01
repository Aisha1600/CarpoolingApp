const pool = require('../db.js');
const router = require('express').Router();
const ride_controller = require("../controllers/ride_controller.js");

//router.post('/member/:member_id/CreateRide', ride_controller.CreateRide)
router.post('/JRide', ride_controller.CreateRideJ)
//working
router.post('/Eride', ride_controller.EditARidee)
//working
router.delete('/deleteR', ride_controller.DeleteARidee)
// router.get('/getAride/:id', ride_controller.GetARide)
router.get('/Getallrides', ride_controller.GetAllUserRides)
//not checked yet
//GetAllRides
router.get('/GetAll', ride_controller.GetAllRides)
router.get('/GetAllCurrentRides', ride_controller.GetAllCurrentRides)



module.exports = router;
