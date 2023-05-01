const express = require("express");
const router = express.Router();
const request_controller= require('../controllers/requestcreated_controller')

router.post('/Createrequest', request_controller.CreateRequest)
router.post('/EditRequest', request_controller.EditRequest)
router.delete('/DeleteRequest', request_controller.DeleteRequest)
router.get('/getAllRequests', request_controller.GetAllRequests)
router.get('/GetUserRequests', request_controller.GetUserRequests)


module.exports = router;