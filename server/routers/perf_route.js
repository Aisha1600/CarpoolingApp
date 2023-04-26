const pool = require('../db.js');
const router = require('express').Router();
const pref_controller = require("../controllers/pref_controller");

router.post('/member/:member_id/preference', pref_controller.AddPrefer)
router.delete('/DeletePreference/:preference_id', pref_controller.DeletePref)
router.post('/member/:member_id/preference/update', pref_controller.UpdatePrefForMember);
router.get('/member/:member_id/preference', pref_controller.GetPref);



module.exports = router;

