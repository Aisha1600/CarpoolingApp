
const pool = require("./db");


const SignUp = async (req, res) => {
    try {
      const { f_name, l_name, contact_no, gender, password, cnic } = req.body;
  
      // Input validation
      if (!f_name || !l_name || !contact_no || !gender || !password || !cnic) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      console.log('Adding member');
      const result = await pool.query(
        'INSERT INTO member(f_name, l_name, contact_no, gender, password, cnic) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        [f_name, l_name, contact_no, gender, password, cnic]
      );
      const newMember = result.rows[0];
  
      // Response format
      res.status(201).json({
        message: 'Member created successfully',
        member: newMember,
      });
    } catch (error) {
      // Error handling
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
    //get one user

    const GetOneMembers = async (req, res) => {
        try {
          const { member_id } = req.params;
      
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
      };
      
//get one user profile 

//update a user profile

const UpdateUser = async (req, res) => {
    try {
      const { member_id } = req.params;
      const { f_name, l_name, contact_no, license_no, license_valid_from, gender, password, cnic } = req.body;
      const updateUser = await pool.query(
        "UPDATE member SET f_name = $1, l_name=$2, contact_no=$3, license_no=$4, license_valid_from=$5,gender=$6,password=$7,cnic=$8  WHERE member_id =$9",
        [f_name, l_name, contact_no, license_no, license_valid_from, gender, password, cnic, member_id]
      );
  
      res.json("User Information was updated!");
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to update user information" });
    }
  };

//update password

const UpdatePassword = async (req, res) => {
    try {
      const { member_id } = req.params;
      const { password } = req.body;
      const updatePassword = await pool.query(
        "UPDATE member SET password = $1 WHERE member_id = $2",
        [password, member_id]
      );
  
      res.json("User Information was updated!");
    } catch (err) {
      console.error(err.message);
    }
  };

//delete a user

const DeleteMember = async(req, res) => {
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
};

//get one user profile 
const getMember = async (req, res) => {
    try {
      const { member_id } = req;
  
      const username = await pool.query(
        `SELECT * FROM "member" 
        WHERE member_id = $1;`,
        [member_id]
      );
      res.json(username.rows);
    } catch {
      res.sendStatus(400);
    }
  };

    