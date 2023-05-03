const express = require("express");
const router = express.Router();
const request_controller= require('../controllers/requestsent_controller.js');

router.post('/SendRequest', request_controller.SendRequest)

module.exports = router;