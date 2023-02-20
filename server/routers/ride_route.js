const express = require("express");
const router = express.Router();
const ride_controller = require('../controllers/ride_controller')

router.post('/createRide', ride_controller.CreateARide)
router.delete('/delete/:id', ride_controller.DeleteRide)
router.get('/getAride/:id', ride_controller.GetARide)
router.get('/Getallrides', ride_controller.getAllRides)
router.put('/updaterating/:id', ride_controller.updateRideRating)