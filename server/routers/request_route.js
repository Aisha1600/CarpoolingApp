const express = require("express");
const router = express.Router();
const request_controller= require('../controllers/request_controller')

router.post('/createrequest', request_controller.CreateRequest)
router.get('/GetAvailableRides', request_controller.GetAvailableRides)
router.post('/EditRequest/:requestId', request_controller.EditRequest)
router.delete('/DeleteRquest/:requestId', request_controller.DeleteRequest)
router.get('/GetStatusRequest/:requestId', request_controller.GetStatusRequest)
router.put('/UpdateStatus/:requestId', request_controller.UpdateStatus)
router.get('/getAllRequests', request_controller.getAllRequests)

module.exports = router;