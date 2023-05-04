//ALL OK!
//add res.201 response
//add if car exists for member
const pool = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const token = "carpool";
const jwtSecret = 'itsworking';

module.exports={


  //use this for inserting car details and send the token in the api header
  InsertCarDetails: async (req, res) => {
    try {
      const { name, model, make_year, car_regno, car_color } = req.body;
  
      // Input validation
      if (!name || !model || !make_year || !car_regno || !car_color) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
  
      // Insert new car details into the car table
      const newCar = await pool.query(
        'INSERT INTO car (name, model, make_year) VALUES ($1, $2, $3) RETURNING car_id',
        [name, model, make_year]
      );

      // Get the car ID of the newly inserted car
      const car_id = newCar.rows[0].car_id;
  
      // Generate JWT token for car_id
      const carToken = jwt.sign({ car_id }, jwtSecret);

      // Insert the new car details into the member_car table
      const newMemberCar = await pool.query(
        'INSERT INTO member_car (member_id, car_id, car_regno, car_color, car_token) VALUES ($1, $2, $3, $4, $5) RETURNING mcar_id',
        [member_id, car_id, car_regno, car_color, carToken]
      );
  
      res.status(200).send('Car was added to member!');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

   getMemberCarId: async (req, res) => {
    try {
      // Retrieve the token from the request header
      const token = req.headers.authorization;
  
      // Verify the JWT token and extract the member_id
      const decoded = jwt.verify(token, jwtSecret);
      const member_id = decoded.userId;
  
      // Get the member's car ID from the member_car table
      const result = await pool.query(
        'SELECT car_id FROM member_car WHERE member_id = $1',
        [member_id]
      );
  
      // Check if the member has a car associated with them or not
      if (result.rowCount === 0) {
        res.status(404).json({ message: 'No car associated with this member' });
      } else {
        const car_id = result.rows[0].car_id;
        res.status(200).json({ car_id });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving member car ID');
    }
  },  

  DeleteDetails: async (req, res) => {
    try {
      // Retrieve the token from the request header
      const token = req.headers.authorization.split(' ')[1];
  
      // Verify the JWT token and extract the car_id
      const decoded = jwt.verify(token, jwtSecret);
      //const member_id = decoded.userId;
      const car_id = decoded.car_id;
      console.log('Decoded JWT token:', decoded);

  
      // Delete the member_car entry corresponding to the car_id
      await pool.query(
        `DELETE FROM car WHERE car_id = $1`,
        [car_id]
      );
  
      res.status(200).send('Car was deleted');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
  

  updateCarMember: async(req, res) => {
    try {
      const { member_id, car_id } = req.params;
      const { name, model, make_year, car_regno, car_color } = req.body;
  
      // Input validation
      if (!name || !model || !make_year || !car_regno || !car_color) {
        return res.status(400).json({ error: 'Invalid input' });
      }
  
      // Update the car details in the car table
      await pool.query(
        "UPDATE car SET name=$1, model=$2, make_year=$3 WHERE car_id=$4",
        [name, model, make_year, car_id]
      );
  
      // Update the car details in the member_car table
      await pool.query(
        "UPDATE member_car SET car_regno=$1, car_color=$2 WHERE member_id=$3 AND car_id=$4",
        [car_regno, car_color, member_id, car_id]
      );
  
      res.status(200).send("Car details updated!");
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  //tested the query it is working, not showing anything on postman tho only [] 
  GetaCarMember: async(req, res) => {
    try {
      const { member_id } = req;
  
      const data = await pool.query(`
        SELECT m.*, c.*, mc.*
        FROM member m
        LEFT JOIN member_car mc ON m.member_id = mc.member_id
        LEFT JOIN car c ON mc.car_id = c.car_id
        WHERE m.member_id = $1;
      `, [member_id]);
  
      res.status(200).json(data.rows);
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  },  
//working!
getAllCarsOfMember: async (req, res) => {
  try {
    // Retrieve the token from the request header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the member_id
    const decoded = jwt.verify(token, jwtSecret);
    const member_id = decoded.userId;

    // Retrieve the member's cars from the database
    const data = await pool.query(`
      SELECT m.member_id, m.f_name, m.l_name, c.car_id, c.name, c.model, c.make_year, mc.mcar_id, mc.car_regno, mc.car_color
      FROM member m
      LEFT JOIN member_car mc ON m.member_id = mc.member_id
      LEFT JOIN car c ON mc.car_id = c.car_id
      WHERE m.member_id = $1
      GROUP BY m.member_id, m.f_name, m.l_name, c.car_id, c.name, c.model, c.make_year, mc.mcar_id, mc.car_regno, mc.car_color;
    `, [member_id]);

    res.status(200).json(data.rows);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
}


 
}
