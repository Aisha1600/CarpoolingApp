//ALL OK!
const pool = require('../db.js');
const router = require('express').Router();
const MemberController = require("../controllers/member_controller");

// PATCH modify user fields, change password & email- /
router.post('/SignUp',MemberController.SignUp);
//router.post('/member/:member_id/NewMemCar', MemberController.NewMemCar);
//router.post('/NewMemCar/:member_id', MemberController.NewMemCar);
router.put('/UpdateUser/:member_id',MemberController.UpdateUser);
router.put('/UpdatePassword/:member_id',MemberController.UpdatePassword);


// DELETE specified user - /
router.delete('/delete/:member_id', MemberController.DeleteMember);

// POST log out everywhere - /

// GET get username
//router.get('/username', MemberController.getUsername);
router.get('/getMember/:member_id', MemberController.GetOneMembers);
router.get('/GetAllMembers', MemberController.getMember);


module.exports = router;