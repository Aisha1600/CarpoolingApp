const pool = require('../db');
const router = require('express').Router();
const MemberController = require("../controllers/member_controller");

// PATCH modify user fields, change password & email- /
router.post('/SignUp',MemberController.SignUp);
// DELETE specified user - /
router.delete('/', userController.deleteUser);

// POST log out everywhere - /

// GET get username
router.get('/username', userController.getUsername);

module.exports = router;