const pool = require('../db');
const router = require('express').Router();
const membercar_controller = require("../controllers/membercar_controller");

router.post('/InsertCarDetails', membercar_controller.InsertCarDetails)
router.get('/GetCarMember', membercar_controller.GetCarMember)
router.delete('/DeleteCarReg', membercar_controller.DeleteCarReg)
router.put('/UpdateCarM', membercar_controller.UpdateCarM)

router.delete('/DeleteCarColor', membercar_controller.DeleteCarColor)
router.delete('/DeleteCarDetails', membercar_controller.DeleteCarDetails)

router.get('/GetAllDetails', membercar_controller.GetAllDetails)
router.get('/GetCarDetails', membercar_controller.GetCarDetails)



module.exports= router;


