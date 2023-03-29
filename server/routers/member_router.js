const pool = require('../db');
const router = require('express').Router();
const MemberController = require("../controllers/member_controller");

// PATCH modify user fields, change password & email- /
router.post('/SignUp',MemberController.SignUp);
router.put('/UpdateUser',MemberController.UpdateUser);
router.put('/UpdatePassword',MemberController.UpdatePassword);


// DELETE specified user - /
router.delete('/:id', MemberController.DeleteMember);

// POST log out everywhere - /

// GET get username
//router.get('/username', MemberController.getUsername);
router.get('/getMember', MemberController.GetOneMembers);
router.get('/GetAllMembers', MemberController.getMember);


module.exports = router;