const express = require("express");
const router = express.Router();
const requestcreated_controller = require('../controllers/requestcreated_controller')

router.post('/createarequest'/ requestcreated_controller.NewRequest)
router.get('/getAllrequests',requestcreated_controller.getAllRequests)