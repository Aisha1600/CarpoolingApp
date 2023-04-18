const router = require('express').Router();
const recommendationsController = require('../controllers/PythonApi_controller');

router.get('/recommendations/:memberId', recommendationsController.recommendations);
module.exports = router;
