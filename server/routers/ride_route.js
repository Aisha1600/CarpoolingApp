const pool = require('../db.js');
const router = require('express').Router();
const ride_controller = require("../controllers/ride_controller.js");

router.post('/member_car/:mcar_id/createRidee', ride_controller.CreateARidee)
router.post('/ride/:ride_id', ride_controller.EditARide)
router.delete('/deleteride/:ride_id', ride_controller.DeleteARide)
// router.get('/getAride/:id', ride_controller.GetARide)
// router.get('/Getallrides', ride_controller.getAllRides)
router.post('/riderate/:ride_id', ride_controller.RideRating)

module.exports = router;
