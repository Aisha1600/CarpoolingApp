const pool = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');
//need to add jwt tokens 
module.exports={
  //working and integrated
  SignUp: async (req, res) => {
    try {
      const { f_name, l_name, email, contact_no, gender, password, cnic } = req.body;
  
      // Input validation
      if (!f_name || !l_name || !email  || !contact_no || !gender || !password || !cnic) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      console.log('Adding member');
      const result = await pool.query(
        'INSERT INTO member(f_name, l_name, email, contact_no, gender, password, cnic) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [f_name, l_name, email, contact_no, gender, password, cnic]
      );
      const newMember = result.rows[0];
        res.sendStatus(200);
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
  },
  //working and integrated
  login: async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;
     // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Query the database to find the user with the given email
      const result = await pool.query('SELECT * FROM member WHERE email = $1 AND password = $2', [email,password]);  
      // Check if user exists
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Something wrong' });
      }
      console.log(password);
      // Compare password with the one stored in the database
      if (result.rows[0].password.trim() !== password) {
        console.log(result.rows);
        console.log(password);
        console.log(result.rows[0].password);
      //return result.rows[0].password;
         return res.status(401).json({ error: 'Invalid email or password' });

      }
      // User is authenticated, return success message
    return res.status(200).json({ message: 'Login successful' });
   return console.log('login sucessful');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
  LogIn: async (req, res) => {
    try {
    const { email, password } = req.params;
    const user = await pool.query('SELECT * FROM member WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials'});
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials'});
    }
    const token = jwt.sign(
      { user_id: user.rows[0].member_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  },
  GetOneMembers: async (req, res) => {
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
  },
  UpdateUser: async (req, res) => {
    try {
      const { member_id } = req.params;
      const { f_name, l_name, contact_no, email, gender, password, cnic } = req.body;
      const updateUser = await pool.query(
        "UPDATE member SET f_name = $1, l_name = $2, contact_no = $3, email = $4, gender = $5, password = $6, cnic = $7 WHERE member_id = $8",
        [f_name, l_name, contact_no, email, gender, password, cnic, member_id]
      );
  
      res.json("User Information was updated!");
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to update user information" });
    }
},
UpdatePassword: async (req, res) => {
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
},
DeleteMember: async(req, res) => {
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
},

NewMemCar: async(req, res) => {
  try {
    const { member_id } = req.params;
    const { name, model, make_year, license_no, license_valid_from, car_regno, car_color } = req.body;

    // Input validation
    if (!name || !model || !make_year || !license_no || !license_valid_from || !car_regno || !car_color) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Insert new car details into the car table
    const newCar = await pool.query(
      "INSERT INTO car (name, model, make_year, license_no, license_valid_from) VALUES ($1, $2, $3, $4, $5) RETURNING car_id",
      [name, model, make_year, license_no, license_valid_from]
    );

    // Get the car ID of the newly inserted car
    const car_id = newCar.rows[0].car_id;

    // Insert the new car details into the member_car table
    const newMemberCar = await pool.query(
      "INSERT INTO member_car (member_id, car_id, car_regno, car_color) VALUES ($1, $2, $3, $4) RETURNING mcar_id",
      [member_id, car_id, car_regno, car_color]
    );

    res.status(200).send("Car was added to member!");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

/*getMember: async (req, res) => {
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
}*/
};



/*const SignUp = async (req, res) => {
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
*/
    