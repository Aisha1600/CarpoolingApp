const express = require("express");
const router = express.Router();
const car_controller = require("../controllers/car_controller")

router.post('/addcar', car_controller.addCar)
router.get('/DisplayAllCars', car_controller.DisplayAllCars)
router.delete('/delete', car_controller.DeleteCar)
router.put('/update', car_controller.UpdateCar)
router.get('./getcar/:id', car_controller.GetaCar)

module.exports= router;