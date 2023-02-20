const express = require("express");
const router = express.Router();
const requestsent_controller= require('../controllers/requestsent_controller')

router.put('/updatestatus',requestsent_controller.UpdateStatus)
router.get('/getAllrequests', requestsent_controller.getAllRequests)