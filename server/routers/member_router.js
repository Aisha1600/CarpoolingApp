//ALL OK!

const pool = require('../db.js');
const router = require('express').Router();
const MemberController = require("../controllers/member_controller");
const axios = require('axios');

// // Set the Authorization header with the JWT token
// //const token = localStorage.getItem('jwtToken');
// const config = {
//   headers: { Authorization: `Bearer ${token}` }
// };

// // Send PUT request to update user information
// //const response = await 
// axios.put(`/UpdateUserr/${member_id}`, { f_name, l_name, contact_no, email, gender, password, cnic }, config);


// PATCH modify user fields, change password & email- /
router.post('/SignUp',MemberController.SignUp);
//router.post('/member/:member_id/NewMemCar', MemberController.NewMemCar);
//router.post('/NewMemCar/:member_id', MemberController.NewMemCar);
//router.post('/member/:member_id/MemberCar', MemberController.NewMemCar);
//router.post('/login', MemberController.login); //this one is working without jwt auth
router.post('/loogin', MemberController.loogin); 
router.delete('/logout', MemberController.logout); 
router.put('/Update/:member_id',MemberController.Update);
//router.put('/UpdateUserr/:member_id',MemberController.UpdateUserr);
router.put('/UpdatePassword/:member_id',MemberController.UpdatePassword);
router.put('/UpdatePass',MemberController.UpdatePass);



// DELETE specified user - /
router.delete('/delete/:member_id', MemberController.DeleteMember);

// POST log out everywhere - /

// GET get username
//router.get('/username', MemberController.getUsername);
router.get('/getMember/:member_id', MemberController.GetOneMembers);
router.get('/GetAllMembers', MemberController.getMember);


module.exports = router;