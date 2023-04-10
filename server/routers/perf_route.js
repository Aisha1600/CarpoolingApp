const pool = require('../db.js');
const router = require('express').Router();
const pref_controller = require("../controllers/pref_controller");

router.post('/AddPreference', pref_controller.AddPref)
router.delete('/DeletePreference', pref_controller.DeletePref)


module.exports = router;

