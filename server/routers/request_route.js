const express = require("express");
const router = express.Router();
const request_controller= require('../controllers/request_controller')

router.post('/createrequest', request_controller.CreateRequest)
router.put('/updatestatus', request_controller.UpdateStatus)
router.get('/getAllrequests', request_controller.getAllRequests)

module.exports = router;