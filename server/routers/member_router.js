//ALL OK!

const pool = require('../db.js');
const router = require('express').Router();
const MemberController = require("../controllers/member_controller");

// PATCH modify user fields, change password & email- /
router.post('/SignUp',MemberController.SignUp);
router.post('/login', MemberController.login); 
router.delete('/logout', MemberController.logout); 
router.put('/Update/:member_id',MemberController.Update);
router.put('/UpdatePass',MemberController.UpdatePass);
router.put('/InsertLicense',MemberController.InsertLicense);
router.get('/displayProfile',MemberController.GetOneMember);



// DELETE specified user - /
router.delete('/delete/:member_id', MemberController.DeleteMember);

// POST log out everywhere - /

// GET get username
//router.get('/username', MemberController.getUsername);
router.get('/getMember', MemberController.GetOneMembers);
router.get('/GetAllMembers', MemberController.getMember);


module.exports = router;