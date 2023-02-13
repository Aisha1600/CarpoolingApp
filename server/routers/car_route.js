const express = require("express");
const router = express.Router();
const car_controller = require("../controllers/car_controller")

router.post('/addcar', car_controller.addCar)

module.exports= router;