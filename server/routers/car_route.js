const express = require("express");
const router = express.Router();
const car_controller = require("../controllers/car_controller")

router.post('/addcar', car_controller.addCar)
router.get('/DisplayAllCars', car_controller.DisplayAllCars)
router.delete('/delete/:car_id', car_controller.DeleteCar)
// working 
router.put('/update/:car_id', car_controller.UpdateCar)
// working
//router.get('./getcar/:car_id', car_controller.GetaCar)
router.get('/getcar/:car_id', car_controller.GetaCar);


module.exports= router;