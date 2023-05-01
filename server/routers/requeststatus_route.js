const express = require("express");
const router = express.Router();
const requeststatus_controller= require('../controllers/requeststatus_controller');

router.post('/AVAILABLETORIDE', requeststatus_controller.AVAILABLETORIDE)
router.post('/REJECTDRIVER', requeststatus_controller.REJECTDRIVER)
router.post('/ACCEPTDRIVER', requeststatus_controller.ACCEPTDRIVER)
router.post('/NODRIVER', requeststatus_controller.NODRIVER)



module.exports = router;