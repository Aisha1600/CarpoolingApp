const pool = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const token = "carpool";
const jwtSecret = 'itsworking';


//need to add jwt tokens 
module.exports = {
  //working and integrated
  //generate token 

  SignUp: async (req, res) => {
    try {
      const { f_name, l_name, email, contact_no, gender, password, cnic } = req.body;
  
      // Input validation
      if (!f_name || !l_name || !email || !contact_no || !gender || !password || !cnic) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      // Check length of cnic and contact_no
      if (cnic.length !== 13 || contact_no.length !== 11) {
        return res.status(400).json({ error: 'CNIC and contact number should be 13 characters long' });
      }
  
      console.log('Adding member');
      const result = await pool.query(
        'INSERT INTO member(f_name, l_name, email, contact_no, gender, password, cnic) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [f_name, l_name, email, contact_no, gender, password, cnic]
      );
      const newMember = result.rows[0];
      
      // Generate a JWT token for member_id
      const payload = { userId: newMember.member_id };
      const token = jwt.sign(payload, jwtSecret);
  
      // Response format
      res.status(201).json({
        message: 'Member created successfully',
        member: newMember,
        token: token
      });
    } catch (error) {
      // Error handling
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  // SignUp: async (req, res) => {
  //   try {
  //     const { f_name, l_name, email, contact_no, gender, password, cnic } = req.body;

  //     // Input validation
  //     if (!f_name || !l_name || !email || !contact_no || !gender || !password || !cnic) {
  //       return res.status(400).json({ error: 'Invalid input' });
  //     }

  //     console.log('Adding member');
  //     const result = await pool.query(
  //       'INSERT INTO member(f_name, l_name, email, contact_no, gender, password, cnic) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
  //       [f_name, l_name, email, contact_no, gender, password, cnic]
  //     );
  //     const newMember = result.rows[0];
      
  //     // Generate a JWT token for member_id
  //     const payload = { userId: newMember.member_id };
  //     const token = jwt.sign(payload, jwtSecret);

  //     // Response format
  //     res.status(201).json({
  //       message: 'Member created successfully',
  //       member: newMember,
  //       token: token
  //     });
  //   } catch (error) {
  //     // Error handling
  //     console.error(error);
  //     res.status(500).json({ error: 'Something went wrong' });
  //   }
  // },

  //need to integrate this one
  login: async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Query the database to find the user with the given email
      const result = await pool.query('SELECT * FROM member WHERE email = $1 AND password = $2', [email, password]);
      // Check if user exists
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // console.log('Result from member table:', result);

      // Generate a JWT
      const payload = { userId: result.rows[0].member_id };
      const token = jwt.sign(payload, jwtSecret);

      // Insert the generated token into the jwt_tokens table for the logged-in user
      const Memberid = result.rows[0].member_id;
      // console.log(result.rows[0].member_id);
      const insertQuery = 'INSERT INTO jwt_tokens (member_id, token) VALUES ($1, $2)';
      await pool.query(insertQuery, [Memberid, token]);

      // Return success message with token
      return res.status(200).json({ 
        message: 'Login successful', 
        token: token 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  //integrate this
  logout: async (req, res) => {
    try {
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Delete the token from the jwt_tokens table for the logged-out user
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.userId;
  
      const deleteQuery = 'DELETE FROM jwt_tokens WHERE member_id = $1';
      await pool.query(deleteQuery, [userId]);
  
      // Return success message
      return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  InsertLicense: async (req, res) => {
    try {
      // Retrieve the token from the request header
      const token = req.headers.authorization;
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
  
      // Extract the updated details from the request body
      const { license_no, license_valid_from  } = req.body;
  
      // Update the member details in the database
      await pool.query(
        `UPDATE member SET license_no = $1, license_valid_from = $2 WHERE member_id = $3`,
        [license_no, license_valid_from, member_id]
      );
  
      res.status(200).send('Member details updated successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },  

  //with jwt auth, integrate this
  Update: async (req, res) => {
    try {
      const { member_id } = req.params;
      const { f_name, l_name, contact_no, email, gender, password, cnic } = req.body;
  
      // Retrieve the token from the database for the logged-in user
      const tokenQuery = 'SELECT token FROM jwt_tokens WHERE member_id = $1';
      const result = await pool.query(tokenQuery, [member_id]);
      //console.log(result);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'User not authorized' });
      }
      const token = result.rows[0].token;
  
      // Verify the JWT token
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.member_id;
  
      // Check if the user has permission to update this user's information
      const userQuery = 'SELECT * FROM member WHERE member_id = $1';
      const userResult = await pool.query(userQuery, [member_id]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = userResult.rows[0];
      if (user.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Update the user information in the database
      const updateUserQuery = `
        UPDATE member 
        SET f_name = $1, l_name = $2, contact_no = $3, email = $4, gender = $5, password = $6, cnic = $7 
        WHERE member_id = $8`;
      const updateUserResult = await pool.query(updateUserQuery, [f_name, l_name, contact_no, email, gender, password, cnic, member_id]);
  
      res.json("User Information was updated!");
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to update user information" });
    }
  },  

  

  GetOneMembers: async (req, res) => {
    try {
      // Retrieve the token from the request header
      const token = req.headers.authorization;
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
  
      // Get the member information from the database
      const member = await pool.query(
        `SELECT * FROM "member"
        WHERE member_id = $1;`,
        [member_id]
      );
  
      res.json(member.rows);
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  },  
  //jwt authentication 
  UpdatePass: async (req, res) => {
    try {
      const { password } = req.body;
  
      // Retrieve the token from the request header
      const token = req.headers.authorization;
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const userId = decoded.userId;
      console.log(`The extracted member_id from the JWT token is: ${userId}`);
      console.log('Decoded JWT token:', decoded);
  
      // Check if the user has permission to update this user's password
      const userQuery = 'SELECT * FROM member WHERE member_id = $1';
      const userResult = await pool.query(userQuery, [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = userResult.rows[0];
      if (user.member_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
  
      // Update the user's password in the database
      const updatePasswordQuery = `
        UPDATE member 
        SET password = $1 
        WHERE member_id = $2`;
      const updatePasswordResult = await pool.query(updatePasswordQuery, [password, userId]);
  
      res.json("User's password was updated!");
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to update user's password" });
    }
  },
  

  DeleteMember: async (req, res) => {
    try {
      const { member_id } = req.params;
      const deleteMember = await pool.query(
        "DELETE FROM member WHERE member_id = $1",
        [member_id]
      );
      res.json("member was deleted!");
    } catch (err) {
      console.error(err.message);
    }
  },
//to use right now
  GetOneMember: async (req, res) => {
    try {
      // Retrieve the token from the request header
      const token = req.headers.authorization;
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
  
      // Get the member information from the database
      const member = await pool.query(
        `SELECT * FROM "member"
        WHERE member_id = $1;`,
        [member_id]
      );
  
      res.status(200).json(member.rows);
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  },
  //working
  getMember: async (req, res) => {
    try {
      // const { member_id } = req;

      const members = await pool.query(
        `SELECT * FROM "member";`//,
        //  [member_id]
      );
      // console.log(members.rows); // log the array of member data
      res.status(200).json(members.rows);
      //console.log('hello');
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error retrieving member data" });
    }
  }
}
