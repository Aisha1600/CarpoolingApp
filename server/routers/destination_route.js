const pool = require('../db.js');
const router = require('express').Router();
const destination_controller = require("../controllers/destination_controller");

// router.post('/InsertSource', destination_controller.InsertSource)
// router.get('/GetSource', destination_controller.GetSource)
// router.delete('/DeleteSource', destination_controller.DeleteSource)
// router.put('/UpdateSource', destination_controller.UpdateSource)

// router.post('/InsertDestination', destination_controller.InsertDestination)
// router.get('/GetDest', destination_controller.GetDest)
// router.delete('/DeleteDest', destination_controller.DeleteDest)
// router.put('/UpdateDest', destination_controller.UpdateDest)

router.post('/addLocationsComplete',destination_controller.addLocationsComplete);
router.post('/UpdateLocations', destination_controller.UpdateLocations);
router.put('/UpdateLocations/:destination_id', destination_controller.UpdateLocations);
router.delete('/delete/:destination_id', destination_controller.deleteLocations);
router.get('/getdestination/:destination_id', destination_controller.getLocation);


module.exports= router;
